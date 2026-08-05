import { Inject, Logger, forwardRef } from '@nestjs/common';
import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';

import { TwinsService } from '../twins/twins.service';
import { TwinStatus } from '../twins/enums/twin-status.enum';
import { MatchingService } from '../matching/matching.service';
import {
  TWIN_WAKE_QUEUE,
  TwinWakeJobName,
  DEFAULT_MAX_CANDIDATES,
  buildProcessJobId,
  ScanJobData,
  ProcessTwinWakeJobData,
} from './twin-wake.job';

/**
 * Worker concurrency = batch size. This controls how many per-twin PROCESS
 * jobs run in parallel, giving true batch processing under BullMQ's control.
 * Read from env at load time (falls back to 5).
 */
const WORKER_CONCURRENCY = parseInt(process.env.SCHEDULER_BATCH_SIZE || '5', 10);

/**
 * Processes twin-wake jobs off the {@link TWIN_WAKE_QUEUE} queue.
 *
 * Two job types:
 *  - SCAN:    finds twins whose `nextWake` is due and fans out PROCESS jobs
 *             in batches (idempotent enqueue via deterministic job ids).
 *  - PROCESS: runs the matching cycle for a single twin and reschedules its
 *             next wake time with jitter. Idempotent and retry-safe.
 */
@Processor(TWIN_WAKE_QUEUE, { concurrency: WORKER_CONCURRENCY })
export class TwinWakeProcessor extends WorkerHost {
  private readonly logger = new Logger(TwinWakeProcessor.name);

  constructor(
    @InjectQueue(TWIN_WAKE_QUEUE) private readonly wakeQueue: Queue,
    private readonly twinsService: TwinsService,
    @Inject(forwardRef(() => MatchingService))
    private readonly matchingService: MatchingService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  /**
   * BullMQ entry point. Dispatches based on job name.
   */
  async process(job: Job): Promise<unknown> {
    switch (job.name) {
      case TwinWakeJobName.SCAN:
        return this.handleScan(job as Job<ScanJobData>);
      case TwinWakeJobName.PROCESS:
        return this.handleProcess(job as Job<ProcessTwinWakeJobData>);
      default:
        this.logger.warn(`Received unknown job "${job.name}" (id=${job.id}); ignoring.`);
        return undefined;
    }
  }

  /**
   * SCAN: find eligible twins and enqueue per-twin PROCESS jobs in batches.
   */
  private async handleScan(job: Job<ScanJobData>): Promise<{ enqueued: number }> {
    const now = new Date().toISOString();
    const eligibleTwins = await this.twinsService.getEligibleTwins(now);

    if (eligibleTwins.length === 0) {
      this.logger.debug('Scan found no eligible twins.');
      return { enqueued: 0 };
    }

    this.logger.log(`Scan found ${eligibleTwins.length} eligible twin(s); enqueuing.`);

    const batchSize = this.configService.get<number>('SCHEDULER_BATCH_SIZE', 5);
    let enqueued = 0;

    for (let i = 0; i < eligibleTwins.length; i += batchSize) {
      const batch = eligibleTwins.slice(i, i + batchSize);

      await this.wakeQueue.addBulk(
        batch.map((twin) => ({
          name: TwinWakeJobName.PROCESS,
          data: {
            twinId: twin.id,
            userId: twin.userId,
            scheduledWake: twin.nextWake,
          } as ProcessTwinWakeJobData,
          opts: {
            // Deterministic id → duplicate enqueues for the same wake window
            // are de-duplicated by BullMQ (idempotent).
            jobId: buildProcessJobId(twin.id, twin.nextWake),
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: true,
            removeOnFail: 100,
          },
        })),
      );

      enqueued += batch.length;
    }

    this.logger.log(`Scan (job ${job.id}) enqueued ${enqueued} PROCESS job(s).`);
    return { enqueued };
  }

  /**
   * PROCESS: run the matching cycle for one twin and reschedule its next wake.
   *
   * Idempotency: the twin's `nextWake` is used as a guard. Once a run completes
   * it advances `nextWake`, so any re-delivered/duplicate job detects the stale
   * window and no-ops. Failures throw so BullMQ retries with backoff; on the
   * final attempt the twin's status is reverted to ACTIVE so it never gets
   * stuck in SEARCHING.
   */
  private async handleProcess(job: Job<ProcessTwinWakeJobData>): Promise<void> {
    const { twinId, userId, scheduledWake } = job.data;

    let twin;
    try {
      twin = await this.twinsService.getTwin(userId);
    } catch {
      // Twin no longer exists — nothing to do (idempotent no-op).
      this.logger.debug(`Twin for user ${userId} not found; skipping wake.`);
      return;
    }

    // Idempotency guard: skip if this wake window was already processed.
    if (twin.nextWake !== scheduledWake) {
      this.logger.debug(
        `Twin ${twinId} already rescheduled (expected ${scheduledWake}, got ${twin.nextWake}); skipping.`,
      );
      return;
    }

    // Do not disrupt a twin that is mid-conversation.
    if (twin.status === TwinStatus.TALKING || twin.status === TwinStatus.EVALUATING) {
      this.logger.debug(`Twin ${twinId} is busy (${twin.status}); skipping this wake.`);
      return;
    }

    try {
      await this.twinsService.updateStatus(twinId, TwinStatus.SEARCHING);
      await this.matchingService.startMatching(userId, DEFAULT_MAX_CANDIDATES);

      const nextWake = this.calculateNextWake();
      await this.twinsService.updateTwinWake(twinId, nextWake);
      await this.twinsService.updateStatus(twinId, TwinStatus.ACTIVE);

      this.logger.log(`Processed wake for twin ${twinId}; next wake at ${nextWake}.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Wake processing failed for twin ${twinId}: ${message}`);

      // On the final attempt, ensure the twin is not left stuck in SEARCHING.
      const maxAttempts = job.opts.attempts ?? 1;
      if (job.attemptsMade >= maxAttempts) {
        await this.safeRevert(twinId);
      }

      // Rethrow so BullMQ applies retry + backoff.
      throw error;
    }
  }

  /**
   * Compute the next wake timestamp with jitter to avoid a thundering herd.
   */
  private calculateNextWake(): string {
    const baseMinutes = this.configService.get<number>('SCHEDULER_BASE_MINUTES', 60);
    const jitterMinutes = this.configService.get<number>('SCHEDULER_JITTER_MINUTES', 15);
    const randomJitter = Math.floor(Math.random() * Math.max(0, jitterMinutes));

    const next = new Date();
    next.setMinutes(next.getMinutes() + baseMinutes + randomJitter);
    return next.toISOString();
  }

  /**
   * Best-effort status revert; never throws.
   */
  private async safeRevert(twinId: string): Promise<void> {
    try {
      await this.twinsService.updateStatus(twinId, TwinStatus.ACTIVE);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to revert status for twin ${twinId}: ${message}`);
    }
  }
}

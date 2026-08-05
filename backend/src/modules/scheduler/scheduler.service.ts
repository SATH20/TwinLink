import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

import {
  TWIN_WAKE_QUEUE,
  TwinWakeJobName,
  REPEATABLE_SCAN_JOB_ID,
  ScanJobData,
} from './twin-wake.job';

/**
 * Scheduler producer for the Digital Twin wake pipeline.
 *
 * Instead of processing twins inline, this service registers a single
 * repeatable SCAN job on the BullMQ {@link TWIN_WAKE_QUEUE} queue. The
 * {@link TwinWakeProcessor} consumes that job, finds eligible twins, and
 * fans out per-twin PROCESS jobs (batched, retried, idempotent).
 */
@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectQueue(TWIN_WAKE_QUEUE) private readonly wakeQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register (or refresh) the repeatable SCAN job on startup.
   */
  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing Scheduler (BullMQ producer)...');

    const intervalMinutes = this.configService.get<number>('SCHEDULER_INTERVAL_MINUTES', 5);
    const intervalMs = intervalMinutes * 60 * 1000;

    await this.registerRepeatableScan(intervalMs);

    this.logger.log(
      `Scheduler registered repeatable scan every ${intervalMinutes} minute(s) (${intervalMs}ms).`,
    );
  }

  /**
   * Registers the repeatable SCAN job. Uses a stable job id so repeated calls
   * across restarts do not create duplicate schedulers (idempotent).
   */
  private async registerRepeatableScan(everyMs: number): Promise<void> {
    await this.wakeQueue.add(
      TwinWakeJobName.SCAN,
      { triggeredAt: new Date().toISOString() } as ScanJobData,
      {
        repeat: { every: everyMs },
        jobId: REPEATABLE_SCAN_JOB_ID,
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );
  }

  /**
   * Manually trigger a one-off scan cycle (e.g. for admin/testing).
   */
  async triggerScanNow(): Promise<void> {
    await this.wakeQueue.add(
      TwinWakeJobName.SCAN,
      { triggeredAt: new Date().toISOString() } as ScanJobData,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );
    this.logger.log('Manual scan cycle enqueued.');
  }
}

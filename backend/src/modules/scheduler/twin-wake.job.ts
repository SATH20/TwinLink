/**
 * Job definitions for the Twin Wake scheduling pipeline.
 *
 * The scheduler uses a single BullMQ queue with two job types:
 *  - SCAN:    a repeatable job that finds twins due for a wake cycle and
 *             fans out PROCESS jobs in batches.
 *  - PROCESS: a per-twin job that runs the matching cycle and reschedules
 *             the twin's next wake time.
 */

/** Name of the BullMQ queue that drives twin wake scheduling. */
export const TWIN_WAKE_QUEUE = 'twin-wake';

/** Job names handled by the {@link TwinWakeProcessor}. */
export enum TwinWakeJobName {
  /** Repeatable scan that fans out per-twin PROCESS jobs. */
  SCAN = 'scan-eligible-twins',
  /** Single-twin wake processing job. */
  PROCESS = 'process-twin-wake',
}

/**
 * Stable id for the repeatable SCAN job. Using a fixed id makes registration
 * idempotent: re-adding the repeatable on every boot will not create duplicates.
 */
export const REPEATABLE_SCAN_JOB_ID = 'twin-wake-scan-repeatable';

/** Default number of candidates requested per matching run. */
export const DEFAULT_MAX_CANDIDATES = 10;

/** Payload for a {@link TwinWakeJobName.SCAN} job. */
export interface ScanJobData {
  /** ISO timestamp of when the scan was triggered. */
  triggeredAt: string;
}

/** Payload for a {@link TwinWakeJobName.PROCESS} job. */
export interface ProcessTwinWakeJobData {
  /** Firestore id of the twin to process. */
  twinId: string;
  /** Owning user's id (used to load the twin and start matching). */
  userId: string;
  /**
   * The twin's `nextWake` value at the moment it was scheduled. Acts as the
   * idempotency key component so re-delivered jobs can detect stale work.
   */
  scheduledWake: string;
}

/**
 * Builds a deterministic job id for a per-twin PROCESS job. Two scans that pick
 * up the same twin for the same wake window will produce the same id, so BullMQ
 * de-duplicates them automatically (idempotent enqueue).
 */
export function buildProcessJobId(twinId: string, scheduledWake: string): string {
  return `twin:${twinId}:${scheduledWake}`;
}

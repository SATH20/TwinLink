import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { SchedulerService } from './scheduler.service';
import { TwinWakeProcessor } from './twin-wake.processor';
import { TWIN_WAKE_QUEUE } from './twin-wake.job';
import { TwinsModule } from '../twins/twins.module';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    ConfigModule,
    TwinsModule,
    forwardRef(() => MatchingModule),

    // ── BullMQ connection (scoped to this module) ────────
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host', 'localhost'),
          port: config.get<number>('redis.port', 6379),
          password: config.get<string>('redis.password') || undefined,
          db: config.get<number>('redis.db', 0),
        },
      }),
    }),

    // ── Twin-wake queue with shared default job options ──
    BullModule.registerQueue({
      name: TWIN_WAKE_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }),
  ],
  providers: [SchedulerService, TwinWakeProcessor],
  exports: [SchedulerService],
})
export class SchedulerModule {}

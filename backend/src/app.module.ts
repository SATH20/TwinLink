import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';

// ── Configuration ─────────────────────────────────────────
import { appConfig, firebaseConfig, redisConfig, aiServiceConfig, clerkConfig } from './config';

// ── Core Modules ──────────────────────────────────────────
import { CommonModule } from './common/common.module';
import { FirebaseModule } from './firebase/firebase.module';

// ── Feature Modules ───────────────────────────────────────
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TwinsModule } from './modules/twins/twins.module';
import { AiModule } from './modules/ai/ai.module';
import { MatchingModule } from './modules/matching/matching.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { CompatibilityModule } from './modules/compatibility/compatibility.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
// import { SchedulerModule } from './modules/scheduler/scheduler.module'; // Temporarily disabled - Redis not running

// ── Health Check ──────────────────────────────────────────
import { HealthController } from './health.controller';

/**
 * Root application module for TwinLink backend.
 *
 * Architecture: Modular Monolith
 * - Each feature module is independent and self-contained
 * - Cross-module communication via exported services
 * - Global modules (Common, Firebase) available everywhere
 * - Configuration loaded from environment variables
 */
@Module({
  imports: [
    // ── Environment Configuration ───────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, firebaseConfig, redisConfig, aiServiceConfig, clerkConfig],
      envFilePath: ['.env', '.env.local'],
      expandVariables: true,
    }),

    // ── Rate Limiting ───────────────────────────────────
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ([{
        ttl: config.get<number>('app.throttle.ttl', 60000),
        limit: config.get<number>('app.throttle.limit', 60),
      }]),
    }),

    // ── Health Checks ───────────────────────────────────
    TerminusModule,

    // ── Core Infrastructure ─────────────────────────────
    CommonModule,
    FirebaseModule,

    // ── Feature Modules ─────────────────────────────────
    AuthModule,
    UsersModule,
    ProfilesModule,
    AiModule,
    TwinsModule,
    MatchingModule,
    ConversationModule,
    CompatibilityModule,
    NotificationsModule,
    // SchedulerModule, // Temporarily disabled - Redis not running
  ],
  controllers: [HealthController],
  providers: [
    // ── Global Rate Limiting Guard ──────────────────────
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

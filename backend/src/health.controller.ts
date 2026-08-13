import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthCheckResult,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { FirebaseService } from './firebase/firebase.service';

/**
 * Health check controller for monitoring system status.
 * Provides endpoints for load balancers, orchestrators, and monitoring tools.
 */
@ApiTags('Health')
@Controller('v1/health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly firebaseService: FirebaseService,
  ) {}

  /**
   * Comprehensive health check endpoint.
   * Checks connectivity to Firebase Firestore.
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'System health check' })
  @ApiResponse({ status: 200, description: 'System is healthy' })
  @ApiResponse({ status: 503, description: 'System is unhealthy' })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      // Firebase Firestore connectivity check
      async (): Promise<HealthIndicatorResult> => {
        try {
          const firestore = this.firebaseService.getFirestore();
          // Attempt a lightweight read to verify connectivity
          await firestore.collection('_health').doc('ping').get();
          return { firestore: { status: 'up' } };
        } catch {
          return { firestore: { status: 'down' } };
        }
      },
    ]);
  }

  /**
   * Simple liveness probe — always returns 200 if the process is alive.
   */
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  live(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

import { Controller, Post, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Development Seed')
@Controller('dev/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('users')
  @ApiOperation({ summary: 'Seed database with 20 realistic Indian test users (DEV ONLY)' })
  @ApiResponse({ status: 201, description: 'Users seeded successfully' })
  async seedUsers() {
    const result = await this.seedService.seedTestUsers();
    
    return {
      success: true,
      message: `Seeded ${result.successCount} out of ${result.totalUsers} test users`,
      summary: {
        total: result.totalUsers,
        created: result.successCount,
        failed: result.failureCount,
      },
      users: result.results.filter(r => r.success).map(r => ({
        name: r.name,
        email: r.email,
        userId: r.userId,
        profileId: r.profileId,
        twinId: r.twinId,
      })),
      failures: result.results.filter(r => !r.success).map(r => ({
        name: r.name,
        email: r.email,
        error: r.error,
      })),
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'List all seeded test users with profile and twin (DEV ONLY)' })
  @ApiResponse({ status: 200, description: 'Seeded users retrieved' })
  async listUsers() {
    const result = await this.seedService.listTestUsers();

    return {
      success: true,
      count: result.count,
      users: result.users.map(u => ({
        userId: u.id,
        name: u.name,
        email: u.email,
        profileId: u.profile?.id ?? null,
        twinId: u.twin?.id ?? null,
        twinStatus: u.twin?.status ?? null,
      })),
    };
  }

  @Delete('users')
  @ApiOperation({ summary: 'Clean up all test users (DEV ONLY)' })
  @ApiResponse({ status: 200, description: 'Test users cleaned up' })
  async cleanupUsers() {
    const result = await this.seedService.cleanupTestUsers();
    
    return {
      success: true,
      message: `Cleaned up ${result.deletedCount} test users`,
      deletedCount: result.deletedCount,
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Check seed status' })
  @ApiResponse({ status: 200, description: 'Seed status retrieved' })
  async getStatus() {
    return {
      success: true,
      message: 'Seed service is available',
      note: 'Use POST /dev/seed/users to create test users',
    };
  }
}

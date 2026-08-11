import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { MatchingService } from './matching.service';
import { StartMatchingDto } from './dto/start-matching.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard'; // Assume this path

@ApiTags('Matching')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('start')
  @ApiOperation({ summary: 'Starts matching process for the authenticated user' })
  @ApiBody({ type: StartMatchingDto })
  @ApiResponse({ status: 201, description: 'Matching started successfully', type: [MatchResultDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async startMatching(
    @CurrentUser() user: any,
    @Body() dto: StartMatchingDto
  ) {
    const result = await this.matchingService.startMatching(user.userId, dto.maxCandidates);
    // NOTE: no top-level `success` key here on purpose — the global
    // TransformInterceptor wraps this object as `{ success, data, meta }`, and
    // the frontend unwraps `.data`, so it receives the full diagnostics object.
    return {
      candidatesFound: result.candidates.length,
      totalCandidates: result.totalCandidates,
      eliminated: result.eliminated,
      persisted: result.persisted,
      eliminationReasons: result.eliminationReasons,
      candidates: result.candidates,
    };
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Returns current match recommendations' })
  @ApiResponse({ status: 200, description: 'Recommendations retrieved', type: [MatchResultDto] })
  async getRecommendations(@CurrentUser() user: any) {
    return this.matchingService.getRecommendations(user.userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Returns match history' })
  @ApiResponse({ status: 200, description: 'History retrieved', type: [MatchResultDto] })
  async getHistory(@CurrentUser() user: any) {
    return this.matchingService.getMatchHistory(user.userId);
  }

  @Post(':matchId/accept')
  @ApiOperation({ summary: 'Accept an introduction and unlock the human chat' })
  @ApiResponse({ status: 201, description: 'Introduction accepted; match is now active' })
  @ApiResponse({ status: 403, description: 'Not a participant in this match' })
  @ApiResponse({ status: 404, description: 'Match not found' })
  async acceptIntroduction(
    @CurrentUser() user: any,
    @Param('matchId') matchId: string,
  ) {
    const match = await this.matchingService.acceptIntroduction(user.userId, matchId);
    return { success: true, match };
  }
}

// DEV-ONLY: Test endpoint without auth
@ApiTags('Development Matching')
@Controller('dev/matching')
export class DevMatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('test/:userId')
  @ApiOperation({ summary: 'DEV ONLY: Test matching for a specific user without auth' })
  @ApiResponse({ status: 201, description: 'Matching test completed' })
  async testMatching(
    @Param('userId') userId: string,
    @Body() dto: { maxCandidates?: number }
  ) {
    const result = await this.matchingService.startMatching(userId, dto.maxCandidates || 10);
    return {
      success: true,
      candidatesFound: result.candidates.length,
      totalCandidates: result.totalCandidates,
      eliminated: result.eliminated,
      persisted: result.persisted,
      eliminationReasons: result.eliminationReasons,
      data: result.candidates,
    };
  }
}

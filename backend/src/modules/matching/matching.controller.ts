import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
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
    const candidates = await this.matchingService.startMatching(user.userId, dto.maxCandidates);
    return { success: true, candidatesFound: candidates.length, data: candidates };
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
}

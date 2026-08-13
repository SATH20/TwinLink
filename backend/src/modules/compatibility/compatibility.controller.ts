import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CompatibilityService } from './compatibility.service';
import { AnalyzeCompatibilityDto } from './dto/analyze-compatibility.dto';
import { CompatibilityResultDto } from './dto/compatibility-result.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@ApiTags('Compatibility')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/compatibility')
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Triggers compatibility analysis for a conversation' })
  @ApiBody({ type: AnalyzeCompatibilityDto })
  @ApiResponse({ status: 201, description: 'Analysis completed', type: CompatibilityResultDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async analyze(
    @Body() dto: AnalyzeCompatibilityDto,
  ): Promise<CompatibilityResultDto> {
    return this.compatibilityService.analyzeCompatibility(dto.conversationId);
  }
}

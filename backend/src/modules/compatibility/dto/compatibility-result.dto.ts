import { ApiProperty } from '@nestjs/swagger';

class DetailedAnalysisDto {
  @ApiProperty()
  emotional: number;

  @ApiProperty()
  intellectual: number;

  @ApiProperty()
  lifestyle: number;

  @ApiProperty()
  values: number;

  @ApiProperty()
  communication: number;
}

export class CompatibilityResultDto {
  @ApiProperty({ description: 'Overall compatibility score (0-100)' })
  compatibilityScore: number;

  @ApiProperty({ description: 'AI confidence score (0-100)' })
  confidenceScore: number;

  @ApiProperty({ type: [String], description: 'List of matching strengths' })
  strengths: string[];

  @ApiProperty({ type: [String], description: 'List of matching weaknesses/challenges' })
  weaknesses: string[];

  @ApiProperty({ description: 'Match recommendation string' })
  recommendation: string;

  @ApiProperty({ description: 'Summary of the compatibility' })
  summary: string;

  @ApiProperty({ type: DetailedAnalysisDto, description: 'Detailed dimension scores' })
  detailedAnalysis: DetailedAnalysisDto;
}

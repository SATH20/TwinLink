import { ApiProperty } from '@nestjs/swagger';
import { MatchStatus } from '../enums/match-status.enum';

/**
 * DTO for returning a match result.
 */
export class MatchResultDto {
  @ApiProperty({ description: 'The unique match ID' })
  matchId: string;

  @ApiProperty({ description: 'The ID of the other user in the match' })
  userId: string;

  @ApiProperty({ description: 'Compatibility score from 0 to 100' })
  compatibilityScore: number;

  @ApiProperty({ description: 'Confidence score from 0 to 100' })
  confidenceScore: number;

  @ApiProperty({ enum: MatchStatus, description: 'Current status of the match' })
  status: MatchStatus;

  @ApiProperty({ description: 'A summary of why this match was made' })
  summary: string;

  @ApiProperty({ type: [String], description: 'Strengths of this match' })
  strengths: string[];

  @ApiProperty({ type: [String], description: 'Weaknesses or potential conflicts' })
  weaknesses: string[];

  @ApiProperty({ description: 'Recommendation for proceeding with the match' })
  recommendation: string;

  @ApiProperty({ description: 'ISO date string of when the match was created' })
  createdAt: string;
}

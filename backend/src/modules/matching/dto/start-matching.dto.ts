import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

/**
 * DTO for starting the matching process.
 */
export class StartMatchingDto {
  @ApiPropertyOptional({
    description: 'Maximum number of candidates to return',
    minimum: 1,
    maximum: 20,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(20)
  maxCandidates?: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';

/**
 * Common DTO for pagination query parameters.
 */
export class PaginationDto {
  @ApiPropertyOptional({ minimum: 1, default: 1, description: 'Page number (1-indexed)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    minimum: 1, 
    maximum: MAX_PAGE_SIZE, 
    default: DEFAULT_PAGE_SIZE,
    description: 'Number of items per page'
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit?: number = DEFAULT_PAGE_SIZE;
}

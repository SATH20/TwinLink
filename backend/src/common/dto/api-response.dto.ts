import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseMetaDto {
  @ApiPropertyOptional({ description: 'Current page number' })
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page' })
  limit?: number;

  @ApiPropertyOptional({ description: 'Total number of items' })
  total?: number;

  @ApiProperty({ description: 'Response timestamp in ISO format' })
  timestamp: string;
}

/**
 * Standard API Response Structure
 */
export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates whether the request was successful' })
  success: boolean;

  @ApiPropertyOptional({ description: 'The payload of the response' })
  data?: T;

  @ApiPropertyOptional({ description: 'Optional message describing the response' })
  message?: string;

  @ApiPropertyOptional({ type: () => ApiResponseMetaDto, description: 'Metadata such as pagination and timestamp' })
  meta?: ApiResponseMetaDto;

  /**
   * Factory for successful (200 OK) responses.
   */
  static ok<T>(data: T, message?: string): ApiResponseDto<T> {
    return {
      success: true,
      data,
      message,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  /**
   * Factory for created (201 Created) responses.
   */
  static created<T>(data: T, message?: string): ApiResponseDto<T> {
    return {
      success: true,
      data,
      message,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  /**
   * Factory for paginated responses.
   */
  static paginated<T>(data: T, total: number, page: number, limit: number): ApiResponseDto<T> {
    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

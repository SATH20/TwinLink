import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}

/**
 * Interceptor to standardize successful API responses.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Wraps the response payload into the standard ApiResponseDto format.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Skip wrapping if it's already an ApiResponseDto format
        if (data && typeof data === 'object' && 'success' in data && ('data' in data || 'error' in data)) {
          return data;
        }

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}

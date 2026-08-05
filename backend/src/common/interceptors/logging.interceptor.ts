import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Interceptor for logging incoming requests and outgoing responses.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  /**
   * Intercepts request and response to log duration and details.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse<Response>();
        const delay = Date.now() - now;
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${userAgent} [${delay}ms]`,
        );
      }),
    );
  }
}

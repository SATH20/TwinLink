import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Catch-all filter for unhandled exceptions in the application.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Catches all exceptions, logs them, and returns a 500 response.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : (exception as Error)?.message || 'Internal Server Error';

    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        message,
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Error: ${(exception as Error)?.message}`,
      (exception as Error)?.stack,
    );

    response.status(status).json(errorResponse);
  }
}

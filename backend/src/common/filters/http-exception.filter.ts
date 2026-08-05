import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global filter for handling all HttpExceptions thrown by the application.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Formats the HttpException into a standard JSON response.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorDetails =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as any);

    const errorResponse = {
      success: false,
      error: {
        statusCode: status,
        message: errorDetails.message || exception.message,
        error: errorDetails.error || 'Http Exception',
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    this.logger.error(
      `${request.method} ${request.url} - Status: ${status} - Message: ${JSON.stringify(errorDetails.message)}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }
}

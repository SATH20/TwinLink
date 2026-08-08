import { ValidationPipe, ValidationError, BadRequestException } from '@nestjs/common';

/**
 * Factory function to create a configured ValidationPipe.
 * Applies whitelist and implicit conversion globally.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const formatErrors = (errors: ValidationError[]): any => {
        return errors.reduce((acc, err) => {
          if (err.children && err.children.length > 0) {
            acc[err.property] = formatErrors(err.children);
          } else {
            acc[err.property] = Object.values(err.constraints || {});
          }
          return acc;
        }, {} as any);
      };

      return new BadRequestException({
        message: 'Validation failed',
        error: 'Bad Request',
        details: formatErrors(validationErrors),
      });
    },
  });
}

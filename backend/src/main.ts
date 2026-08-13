import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { createValidationPipe } from './common/pipes/validation.pipe';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

/**
 * Bootstrap the TwinLink NestJS application.
 *
 * Configures:
 * - Global validation pipes
 * - Global exception filters
 * - CORS with configurable origins
 * - Helmet security headers
 * - URI-based API versioning
 * - Swagger documentation
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const logger = new Logger('Bootstrap');

  // ── Security ────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ────────────────────────────────────────────────
  const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()) || [
    'http://localhost:3000',
  ];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // ── Global Pipes ────────────────────────────────────────
  app.useGlobalPipes(createValidationPipe());

  // ── Global Filters ──────────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // ── API Versioning ──────────────────────────────────────
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // ── Swagger Documentation ──────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TwinLink API')
    .setDescription(
      'TwinLink AI Digital Twin Network — Backend API\n\n' +
        'Every user owns one AI Digital Twin that communicates with other twins ' +
        'to evaluate compatibility before recommending matches.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Clerk JWT token',
        in: 'header',
      },
      'bearer',
    )
    .addTag('Health', 'System health checks')
    .addTag('Authentication', 'User authentication via Clerk')
    .addTag('Users', 'User account management')
    .addTag('Profiles', 'User profile management')
    .addTag('Digital Twins', 'AI Digital Twin lifecycle')
    .addTag('Matching', 'Deterministic candidate matching engine')
    .addTag('Conversations', 'Twin-to-twin conversation orchestration')
    .addTag('Compatibility', 'AI-powered compatibility analysis')
    .addTag('Notifications', 'User notification management')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TwinLink API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  // ── Start Server ────────────────────────────────────────
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);

  logger.log(`🚀 TwinLink API running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
  logger.log(`🌍 CORS enabled for: ${corsOrigins.join(', ')}`);
  logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("./common/pipes/validation.pipe");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    const corsOrigins = process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()) || [
        'http://localhost:3000',
    ];
    app.enableCors({
        origin: corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    });
    app.useGlobalPipes((0, validation_pipe_1.createValidationPipe)());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(), new http_exception_filter_1.HttpExceptionFilter());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('TwinLink API')
        .setDescription('TwinLink AI Digital Twin Network — Backend API\n\n' +
        'Every user owns one AI Digital Twin that communicates with other twins ' +
        'to evaluate compatibility before recommending matches.')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Clerk JWT token',
        in: 'header',
    }, 'bearer')
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
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'TwinLink API Documentation',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });
    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen(port);
    logger.log(`🚀 TwinLink API running on http://localhost:${port}`);
    logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
    logger.log(`🌍 CORS enabled for: ${corsOrigins.join(', ')}`);
    logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
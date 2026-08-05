import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse as SwaggerCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * Standard HTTP 200 Response Decorator for Swagger
 */
export const ApiStandardResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

/**
 * Standard HTTP 201 Response Decorator for Swagger
 */
export const ApiCreatedResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    SwaggerCreatedResponse({
      description: description || 'Resource created successfully',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

/**
 * Common Error Responses Decorator for Swagger
 */
export const ApiErrorResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Bad Request / Validation Error' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiInternalServerErrorResponse({ description: 'Internal Server Error' }),
  );
};

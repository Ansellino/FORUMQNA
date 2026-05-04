// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto } from './common/dto/api-response.dto';
import { HealthDataDto } from './common/dto/health-response.dto';

@ApiTags('App')
@ApiExtraModels(ApiResponseDto, HealthDataDto)
@Controller()
export class AppController {
  getHello() {
    return 'Hello World!';
  }

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiOkResponse({
    description: 'API health status',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(HealthDataDto) },
      },
    },
  })
  getStatus() {
    return {
      success: true,
      message: 'Q&A Forum API is running',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        docs: '/api/docs',
      },
    };
  }
}

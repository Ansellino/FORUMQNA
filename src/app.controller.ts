// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  getHello() {
    return 'Hello World!';
  }

  @Get()
  @ApiOperation({ summary: 'Health check' })
  getStatus() {
    return {
      status: 'ok',
      message: 'Q&A Forum API is running',
      timestamp: new Date().toISOString(),
      docs: '/api/docs',
    };
  }
}

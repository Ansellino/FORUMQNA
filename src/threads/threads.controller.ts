import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
  ApiResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThreadsService } from './threads.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Thread } from './thread.entity';

export class CreateThreadDto {
  @ApiProperty({ example: 'How do I use dotenv in Node.js?' })
  @IsString()
  @MinLength(5)
  title: string;
  @ApiProperty({ example: 'I want to hide my API keys...' })
  @IsString()
  @MinLength(10)
  content: string;
}
@ApiTags('Threads')
@ApiExtraModels(ApiResponseDto, Thread)
@Controller('threads')
export class ThreadsController {
  constructor(private svc: ThreadsService) {}
  @Get()
  @ApiOperation({ summary: 'Get all threads' })
  @ApiOkResponse({
    description: 'List thread berhasil diambil',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Thread) } },
        meta: {
          type: 'object',
          properties: { total: { type: 'number', example: 10 } },
        },
      },
    },
  })
  async findAll() {
    const threads = await this.svc.findAll();

    return {
      success: true,
      message: 'Threads berhasil diambil',
      data: threads,
      meta: { total: threads.length },
    };
  }
  @Get('my-threads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my threads' })
  @ApiOkResponse({
    description: 'List thread user berhasil diambil',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Thread) } },
        meta: {
          type: 'object',
          properties: { total: { type: 'number', example: 3 } },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async mine(@Request() req) {
    const threads = await this.svc.findByUser(req.user.userId);

    return {
      success: true,
      message: 'Threads milik user berhasil diambil',
      data: threads,
      meta: { total: threads.length },
    };
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get thread by ID' })
  @ApiOkResponse({
    description: 'Thread berhasil diambil',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(Thread) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Thread tidak ditemukan' })
  async findOne(@Param('id') id: string) {
    const thread = await this.svc.findOne(id);

    return {
      success: true,
      message: 'Thread berhasil diambil',
      data: thread,
    };
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create thread' })
  @ApiCreatedResponse({
    description: 'Thread berhasil dibuat',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(Thread) },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Input tidak valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() dto: CreateThreadDto, @Request() req) {
    const thread = await this.svc.create(dto, req.user.userId);

    return {
      success: true,
      message: 'Thread berhasil dibuat',
      data: thread,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update thread (owner only)' })
  @ApiOkResponse({
    description: 'Thread berhasil diperbarui',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(Thread) },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik thread' })
  @ApiResponse({ status: 404, description: 'Thread tidak ditemukan' })
  async update(
    @Param('id') id: string,
    @Body() dto: CreateThreadDto,
    @Request() req,
  ) {
    const t = await this.svc.findOne(id);
    if (t.user.id !== req.user.userId)
      throw new ForbiddenException('Bukan pemilik thread');
    const thread = await this.svc.update(id, dto);

    return {
      success: true,
      message: 'Thread berhasil diperbarui',
      data: thread,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete thread (owner only)' })
  @ApiOkResponse({
    description: 'Thread berhasil dihapus',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: {
          type: 'object',
          example: { message: 'Thread berhasil dihapus' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik thread' })
  @ApiResponse({ status: 404, description: 'Thread tidak ditemukan' })
  async remove(@Param('id') id: string, @Request() req) {
    const t = await this.svc.findOne(id);
    if (t.user.id !== req.user.userId)
      throw new ForbiddenException('Bukan pemilik thread');
    const result = await this.svc.remove(id);

    return {
      success: true,
      message: 'Thread berhasil dihapus',
      data: result,
    };
  }
}

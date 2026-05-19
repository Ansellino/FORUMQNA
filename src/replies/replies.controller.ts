import {
  Controller, Get, Post, Delete,
  Param, Body, UseGuards, Request,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiCreatedResponse, ApiOkResponse, ApiResponse,
  ApiExtraModels, getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RepliesService } from './replies.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { Reply } from './reply.entity';

@ApiTags('Replies')
@ApiExtraModels(ApiResponseDto, Reply)
@Controller()
export class RepliesController {
  constructor(private readonly svc: RepliesService) {}

  @Get('threads/:threadId/replies')
  @ApiOperation({ summary: 'Get all replies for a thread' })
  @ApiOkResponse({
    description: 'Daftar reply berhasil diambil',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { type: 'array', items: { $ref: getSchemaPath(Reply) } },
        meta: { type: 'object', properties: { total: { type: 'number' } } },
      },
    },
  })
  async findAll(@Param('threadId') threadId: string) {
    const replies = await this.svc.findByThread(threadId);
    return { success: true, message: 'Reply berhasil diambil', data: replies, meta: { total: replies.length } };
  }

  @Post('threads/:threadId/replies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a reply to a thread' })
  @ApiCreatedResponse({
    description: 'Reply berhasil dibuat',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: { data: { $ref: getSchemaPath(Reply) } },
    },
  })
  @ApiResponse({ status: 400, description: 'Input tidak valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Param('threadId') threadId: string,
    @Body() dto: CreateReplyDto,
    @Request() req,
  ) {
    const reply = await this.svc.create(dto, threadId, req.user.userId);
    return { success: true, message: 'Reply berhasil dibuat', data: reply };
  }

  @Delete('replies/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a reply (owner only)' })
  @ApiOkResponse({ description: 'Reply berhasil dihapus' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Bukan pemilik reply' })
  @ApiResponse({ status: 404, description: 'Reply tidak ditemukan' })
  async remove(@Param('id') id: string, @Request() req) {
    const result = await this.svc.remove(id, req.user.userId);
    return { success: true, message: result.message, data: result };
  }
}

import { Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThreadsService } from './threads.service';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
 
export class CreateThreadDto {
  @ApiProperty({ example: 'How do I use dotenv in Node.js?' })
  @IsString() @MinLength(5) title: string;
  @ApiProperty({ example: 'I want to hide my API keys...' })
  @IsString() @MinLength(10) content: string;
}
@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
  constructor(private svc: ThreadsService) {}
  @Get()
  @ApiOperation({ summary: 'Get all threads' })
  findAll() {
    return this.svc.findAll();
  }
  @Get('my-threads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my threads' })
  mine(@Request() req) { return this.svc.findByUser(req.user.userId); }
  @Get(':id') @ApiOperation({ summary: 'Get thread by ID' })
  findOne(@Param("id") id: string) { return this.svc.findOne(id); }
  @Post() @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Create thread' })
  create(@Body() dto: CreateThreadDto, @Request() req) {
    return this.svc.create(dto, req.user.userId);
  }
 
  @Put(':id') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Update thread (owner only)' })
  async update(@Param("id") id: string, @Body() dto: CreateThreadDto, @Request() req) {
    const t = await this.svc.findOne(id);
    if (t.user.id !== req.user.userId) throw new ForbiddenException('Bukan pemilik thread');
    return this.svc.update(id, dto);
  }
 
  @Delete(':id') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete thread (owner only)' })
  async remove(@Param("id") id: string, @Request() req) {
    const t = await this.svc.findOne(id);
    if (t.user.id !== req.user.userId) throw new ForbiddenException('Bukan pemilik thread');
    return this.svc.remove(id);
  }
}

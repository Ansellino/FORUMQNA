// src/users/users.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user public profile by ID' })
  @ApiResponse({ status: 200, description: 'Profil user ditemukan' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User tidak ditemukan');

    // Jangan return password_hash ke client
    const { password_hash, ...result } = user;
    return result;
  }
}
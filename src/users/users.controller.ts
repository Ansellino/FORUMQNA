// src/users/users.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PublicUserDto } from './dto/public-user.dto';

@ApiTags('Users')
@ApiExtraModels(ApiResponseDto, PublicUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user public profile by ID' })
  @ApiOkResponse({
    description: 'Profil user ditemukan',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(PublicUserDto) },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User tidak ditemukan');

    // Jangan return password_hash ke client
    const { password_hash, ...result } = user;
    return {
      success: true,
      message: 'Profil user ditemukan',
      data: result,
    };
  }
}

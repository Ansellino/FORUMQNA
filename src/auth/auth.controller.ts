import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExtraModels,
  ApiCreatedResponse,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import {
  RegisterResponseDataDto,
  LoginResponseDataDto,
} from '../common/dto/auth-response.dto';

@ApiTags('Auth')
@ApiExtraModels(ApiResponseDto, RegisterResponseDataDto, LoginResponseDataDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User berhasil didaftarkan',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(RegisterResponseDataDto) },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Input tidak valid (validasi gagal)',
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password must be longer than or equal to 6 characters'],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email sudah terdaftar',
    type: ErrorResponseDto,
    example: {
      statusCode: 409,
      message: 'Email sudah terdaftar',
      error: 'Conflict',
    },
  })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(
      dto.username,
      dto.email,
      dto.password,
    );

    return {
      success: true,
      message: 'User berhasil didaftarkan',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiOkResponse({
    description: 'Login berhasil, return access_token',
    schema: {
      allOf: [{ $ref: getSchemaPath(ApiResponseDto) }],
      properties: {
        data: { $ref: getSchemaPath(LoginResponseDataDto) },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Input tidak valid (validasi gagal)',
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: ['email must be an email', 'password should not be empty'],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Email atau password salah',
    type: ErrorResponseDto,
    example: {
      statusCode: 401,
      message: 'Email atau password salah',
      error: 'Unauthorized',
    },
  })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.email, dto.password);

    return {
      success: true,
      message: 'Login berhasil',
      data: result,
    };
  }
}

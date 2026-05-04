import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDataDto {
  @ApiProperty({ example: 'Registrasi berhasil' })
  message: string;

  @ApiProperty({ example: '9a3f6f52-2d8d-4b83-b5a6-99f6a2d0a123' })
  userId: string;
}

export class LoginResponseDataDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;
}

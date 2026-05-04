import { ApiProperty } from '@nestjs/swagger';

export class PublicUserDto {
  @ApiProperty({ example: '9a3f6f52-2d8d-4b83-b5a6-99f6a2d0a123' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  username: string;

  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @ApiProperty({ example: '2026-05-04T09:12:34.000Z' })
  created_at: string;
}

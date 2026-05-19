import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateReplyDto {
  @ApiProperty({ example: 'Coba gunakan dotenv dan tambahkan .env ke .gitignore.' })
  @IsString()
  @MinLength(5, { message: 'Balasan minimal 5 karakter' })
  content: string;
}

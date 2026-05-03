import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @ApiProperty({
    example: 'How do I set up environment variables in Node.js?',
    description: 'Judul thread, minimal 5 karakter',
  })
  @IsString({ message: 'Title harus berupa string' })
  @MinLength(5, { message: 'Title minimal 5 karakter' })
  @MaxLength(255, { message: 'Title maksimal 255 karakter' })
  title: string;

  @ApiProperty({
    example:
      'I am new to backend development and confused about how to hide my API keys...',
    description: 'Isi konten thread, minimal 10 karakter',
  })
  @IsString({ message: 'Content harus berupa string' })
  @MinLength(10, { message: 'Content minimal 10 karakter' })
  content: string;
}

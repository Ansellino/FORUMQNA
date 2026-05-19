import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Bad Request' },
      { type: 'array', items: { type: 'string' }, example: ['field must not be empty'] },
    ],
  })
  message: string | string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

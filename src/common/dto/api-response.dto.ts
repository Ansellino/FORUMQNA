import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'OK' })
  message: string;

  @ApiProperty({ nullable: true })
  data: unknown;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  meta?: Record<string, unknown>;
}

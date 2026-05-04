import { ApiProperty } from '@nestjs/swagger';

export class HealthDataDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: '2026-05-04T09:12:34.000Z' })
  timestamp: string;

  @ApiProperty({ example: '/api/docs' })
  docs: string;
}

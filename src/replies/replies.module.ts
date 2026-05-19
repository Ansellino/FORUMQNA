import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './reply.entity';
import { RepliesController } from './replies.controller';
import { RepliesService } from './replies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reply])],
  controllers: [RepliesController],
  providers: [RepliesService],
})
export class RepliesModule {}

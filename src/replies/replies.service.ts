import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './reply.entity';
import { CreateReplyDto } from './dto/create-reply.dto';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply)
    private readonly repo: Repository<Reply>,
  ) {}

  findByThread(threadId: string): Promise<Reply[]> {
    return this.repo.find({
      where: { thread: { id: threadId } },
      order: { created_at: 'ASC' },
    });
  }

  create(dto: CreateReplyDto, threadId: string, userId: string): Promise<Reply> {
    const reply = this.repo.create({
      content: dto.content,
      thread: { id: threadId },
      user: { id: userId },
    });
    return this.repo.save(reply);
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const reply = await this.repo.findOne({ where: { id } });
    if (!reply) throw new NotFoundException('Reply tidak ditemukan');
    if (reply.user.id !== userId) throw new ForbiddenException('Bukan pemilik reply');
    await this.repo.delete(id);
    return { message: 'Reply berhasil dihapus' };
  }
}

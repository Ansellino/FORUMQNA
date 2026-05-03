import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Thread } from './thread.entity';
 
@Injectable()
export class ThreadsService {
  constructor(
    @InjectRepository(Thread)
    private repo: Repository<Thread>,
  ) {}
 
  findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }
 
  findByUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }
 
  async findOne(id: string) {
    const t = await this.repo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('Thread tidak ditemukan');
    return t;
  }
 
  async create(dto: any, userId: string) {
    const t = this.repo.create({ ...dto, user: { id: userId } });
    return this.repo.save(t);
  }
 
  async update(id: string, dto: any) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }
 
  async remove(id: string) {
    await this.repo.delete(id);
    return { message: 'Thread berhasil dihapus' };
  }
}

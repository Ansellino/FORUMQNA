import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Thread } from '../threads/thread.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Thread)
    private readonly threadRepo: Repository<Thread>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepo.create(data);
    return this.usersRepo.save(user);
  }

  async getPublicProfile(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) return null;

    const [recentThreads, threadCount] = await this.threadRepo.findAndCount({
      where: { user: { id } },
      order: { created_at: 'DESC' },
      take: 5,
    });

    const { password_hash, ...publicUser } = user as any;
    return {
      ...publicUser,
      threadCount,
      recentThreads: recentThreads.map(({ user: _u, ...t }) => t),
    };
  }
}

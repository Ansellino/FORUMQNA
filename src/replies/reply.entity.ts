import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Thread } from '../threads/thread.entity';

@Entity('replies')
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'a1b2c3d4-...' })
  id: string;

  @Column('text')
  @ApiProperty({ example: 'Coba gunakan dotenv dan tambahkan .env ke .gitignore.' })
  content: string;

  @CreateDateColumn()
  @ApiProperty({ example: '2026-05-04T09:12:34.000Z' })
  created_at: Date;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToOne(() => Thread, { onDelete: 'CASCADE' })
  thread: Thread;
}

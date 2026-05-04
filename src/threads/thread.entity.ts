import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';
@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '3f9fd2a0-8f78-4a8a-9a1a-1c0d5fb0f9d9' })
  id: string;
  @Column()
  @ApiProperty({ example: 'How do I use dotenv in Node.js?' })
  title: string;
  @Column('text')
  @ApiProperty({ example: 'I want to hide my API keys...' })
  content: string;
  @CreateDateColumn()
  @ApiProperty({ example: '2026-05-04T09:12:34.000Z' })
  created_at: Date;
  @UpdateDateColumn()
  @ApiProperty({ example: '2026-05-04T10:00:00.000Z' })
  updated_at: Date;
  // eager:true = user data otomatis di-load saat query thread
  @ManyToOne(() => User, (user) => user.threads, { eager: true })
  @ApiProperty({ type: () => User })
  user: User;
}

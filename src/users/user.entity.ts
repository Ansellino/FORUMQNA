import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Thread } from '../threads/thread.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: '9a3f6f52-2d8d-4b83-b5a6-99f6a2d0a123' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;

  @Column()
  @ApiHideProperty()
  password_hash: string;

  @CreateDateColumn()
  @ApiProperty({ example: '2026-05-04T09:12:34.000Z' })
  created_at: Date;

  @OneToMany(() => Thread, (thread) => thread.user)
  @ApiProperty({ type: () => [Thread] })
  threads: Thread[];
}

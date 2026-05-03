import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Thread } from '../threads/thread.entity';
 
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column({ unique: true })
  username: string;
 
  @Column({ unique: true })
  email: string;
 
  @Column()
  password_hash: string;
 
  @CreateDateColumn()
  created_at: Date;
 
  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];
}

import { Entity, PrimaryGeneratedColumn, Column,
         CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
 
@Entity('threads')
export class Thread {
  @PrimaryGeneratedColumn('uuid')
  id: string;
 
  @Column()
  title: string;
 
  @Column('text')
  content: string;
 
  @CreateDateColumn()
  created_at: Date;
 
  @UpdateDateColumn()
  updated_at: Date;
 
  // eager:true = user data otomatis di-load saat query thread
  @ManyToOne(() => User, (user) => user.threads, { eager: true })
  user: User;
}

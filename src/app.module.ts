import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Thread } from './threads/thread.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ThreadsModule } from './threads/threads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Thread],
      synchronize: process.env.NODE_ENV === 'development',
      ssl: {
        rejectUnauthorized: false,
      },
      logging: true,
    }),
    UsersModule,
    AuthModule,
    ThreadsModule,
  ],
})
export class AppModule {}

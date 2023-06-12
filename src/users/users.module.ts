import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { AnotherMiddleware } from './middlewares/another.middleware';
import { ExampleMiddleware } from './middlewares/example.middleware';
import { UsersService } from './services/users/users.service';
import { User } from 'src/typeorm/entities/User';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Post';
import { S3Service } from 'src/common/s3.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Post])],
  controllers: [UsersController],
  providers: [UsersService, S3Service],
})
export class UsersModule {}

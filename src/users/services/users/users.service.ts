import { Post } from './../../../typeorm/entities/Post';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserParams,
  CreateUserPostParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from '../../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { S3Service } from 'src/common/s3.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly s3Service: S3Service,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async findUser(options: IPaginationOptions): Promise<Pagination<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.createdAt', 'DESC');
    queryBuilder.leftJoinAndSelect('c.profile', 'profile');
    queryBuilder.leftJoinAndSelect('c.posts', 'post');
    queryBuilder.getOne();
    return paginate<User>(queryBuilder, options);
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        profile: true,
        posts: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async createUser(
    userDetails: CreateUserParams,
    avatarFile: Express.Multer.File,
  ): Promise<User> {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
      avatar: avatarFile
        ? await this.s3Service.uploadFileToS3(avatarFile)
        : null,
    });
    return this.userRepository.save(newUser);
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    return file.filename;
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id });
  }

  async createProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileParams,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        'User not found. Cannot create profile',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const saveProfile = await this.profileRepository.save(newProfile);
    user.profile = saveProfile;
    return this.userRepository.save(user);
  }

  async createPost(id: number, createUserPostDetails: CreateUserPostParams) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user)
      throw new HttpException(
        'User not found. Cannot create Profile',
        HttpStatus.BAD_REQUEST,
      );
    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepository.save(newPost);
  }

  async searchPost(search: string): Promise<Post[]> {
    const post = this.postRepository
      .createQueryBuilder('c')
      .where('c.title LIKE :search', { search: `%${search}%` })
      .orWhere('c.description LIKE :search', { search: `%${search}%` })
      .leftJoinAndSelect('c.user', 'user')
      .getMany();

    return post;
  }
}

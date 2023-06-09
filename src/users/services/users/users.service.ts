import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserParams,
  CreateUserProfileParams,
  UpdateUserParams,
} from '../../../utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { Profile } from 'src/typeorm/entities/Profile';

@Injectable()
export class UsersService {
  // private fakeUsers = [
  //   { username: 'Anson', email: 'anson@anson.com' },
  //   { username: 'Cory', email: 'cory@anson.com' },
  //   { username: 'Greg', email: 'greg@anson.com' },
  // ];
  // fetchUsers() {
  //   return this.fakeUsers;
  // }
  // createUser(userDetails: CreateUserType) {
  //   this.fakeUsers.push(userDetails);
  //   return;
  // }
  // fetchUserById(id: number) {
  //   return { id, username: 'Anson', email: 'anson@email.com' };
  // }

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  findUser() {
    return this.userRepository.find({
      relations: {
        profile: true,
      },
      skip: 4,
    });
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        profile: true,
      },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
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
}

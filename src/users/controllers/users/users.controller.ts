import { CreateUserProfileParams } from './../../../utils/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { ValidateCreateUserPipe } from '../../pipes/validate-create-user.pipe';
import { UsersService } from '../../services/users/users.service';
import moment from 'moment';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfileDto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  // @Get()
  // @UseGuards(AuthGuard)
  // getUsers() {
  //   return this.userService.fetchUsers();
  // }
  // @Post('create')
  // @UsePipes(new ValidationPipe())
  // createUser(@Body(ValidateCreateUserPipe) userData: CreateUserDto) {
  //   console.log(userData.age.toPrecision());
  //   return this.userService.createUser(userData);
  // }
  // @Get(':id')
  // getUserById(@Param('id', ParseIntPipe) id: number) {
  //   const user = this.userService.fetchUserById(id);
  //   if (!user)
  //     throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  //   return user;
  // }

  @Get()
  async getUser() {
    const users = await this.userService.findUser();
    // const userRes = users.forEach((user) => {
    //   console.log('user.c', user.createdAt);
    //   const date = moment(user.createdAt).format('YYYY-MM-DD');
    //   return { ...user, createdAt: date };
    // });
    return { data: users };
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    this.userService.createUser(createUserDto);
    return { messege: 'createUser successfully' };
  }

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log('updateUserDto', updateUserDto);
    await this.userService.updateUser(id, updateUserDto);
    return { message: 'Updated user successfully' };
  }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.userService.deleteUser(id);
    return { message: 'Deleted user successfully' };
  }

  @Post(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfileDto: CreateUserProfileDto,
  ) {
    return this.userService.createProfile(id, createUserProfileDto);
  }
}

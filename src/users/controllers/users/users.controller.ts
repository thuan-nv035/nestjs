import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfileDto';
import { User } from 'src/typeorm/entities/User';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  async getUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<User>> {
    return this.userService.findUser({
      page,
      limit,
    });
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('avatar'))
  createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.userService.createUser(createUserDto, file);
    return { messege: 'createUser successfully' };
  }

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
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

  @Post(':id/post')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserPostDto: CreateUserPostDto,
  ) {
    return this.userService.createPost(id, createUserPostDto);
  }

  @Post('post')
  async searchUserPost(@Query('search') search: string) {
    return this.userService.searchPost(search);
  }

  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  handleUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return 'File upload API';
  }
}

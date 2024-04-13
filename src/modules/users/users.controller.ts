import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {ObjectId} from 'typeorm';
import {SearchUserDTO} from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  search(@Body('name') searchUserDTO: SearchUserDTO) {
    return this.usersService.search(searchUserDTO);
  }

  @Get(':id')
  getDetail(@Param('id') id: ObjectId) {
    return this.usersService.detail(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.usersService.remove(id);
  }
}

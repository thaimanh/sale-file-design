import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {ObjectId} from 'typeorm';
import {SearchUserDTO} from './dto/search-user.dto';
import {Role} from '../../common/interfaces';
import {Roles} from '../auth/decorator/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  search(@Body('name') searchUserDTO: SearchUserDTO) {
    return this.usersService.search(searchUserDTO);
  }

  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: ObjectId) {
    return this.usersService.detail(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: ObjectId, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: ObjectId) {
    return this.usersService.remove(id);
  }
}

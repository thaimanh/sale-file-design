import {Controller, Get, Body, Patch, Param, Delete, UseGuards, Req} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {SearchUserDTO} from './dto/search-user.dto';
import {JWTGuard} from '../auth/guard';
import {Request} from '@nestjs/common';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTGuard)
  @Get()
  search(@Body('name') searchUserDTO: SearchUserDTO) {
    return this.usersService.search(searchUserDTO);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.usersService.detail(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

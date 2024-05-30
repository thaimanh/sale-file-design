import {Controller, Get, Body, Patch, Param, Delete} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {SearchUserDTO} from './dto/search-user.dto';
import {Roles} from '../auth/decorator';
import {Role} from '../../common/const';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  search(@Body('name') searchUserDTO: SearchUserDTO) {
    return this.usersService.search(searchUserDTO);
  }

  @Roles(Role.Admin, Role.User)
  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const result = await this.usersService.findOneById(id);
    return {result};
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const result = await this.usersService.update({id}, updateUserDto);
    return {result};
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.usersService.remove(id);
    return {result};
  }
}

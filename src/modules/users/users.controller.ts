import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import {UserService} from './users.service';
import {UpdateUserDto} from './dto/update-user.dto';
import {SearchUserDTO} from './dto/search-user.dto';
import {Roles} from '../auth/decorator';
import {Role} from '../../common/const';

@Controller('user')
export class UsersController {
  constructor(private usersService: UserService) {}

  @Roles(Role.Admin)
  @Get()
  search(@Body('name') searchUserDTO: SearchUserDTO) {
    return this.usersService.search(searchUserDTO);
  }

  @Roles(Role.Admin, Role.User)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.usersService.displayById(id);
  }

  @Roles(Role.Admin, Role.User)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

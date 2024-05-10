import {Module} from '@nestjs/common';
import {UserService} from './users.service';
import {UsersController} from './users.controller';
import {User, UserSchema} from './schema/user.schema';
import {MongooseModule} from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}

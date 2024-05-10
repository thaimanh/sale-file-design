import {Injectable} from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {IsUniqueType} from '../common/type';
import {InjectModel} from '@nestjs/mongoose';
import {User} from '~/modules/users/schema/user.schema';
import {Model} from 'mongoose';

@ValidatorConstraint({name: 'IsUniqueConstraint', async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async validate(value: any, args?: ValidationArguments): Promise<boolean> {
    // catch options from decorator
    const {tableName, column}: IsUniqueType = args.constraints[0];

    // check unique from database
    const dataExist = await this.userModel.findOne({where: {[column]: value}});

    return !dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    // return custom field message
    const field: string = validationArguments.property;
    return `${field} is already exist`;
  }
}

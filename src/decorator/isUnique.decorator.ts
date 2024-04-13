import {registerDecorator, ValidationOptions} from 'class-validator';
import {IsUniqueType} from '../definition/type';
import {IsUniqueConstraint} from '../validation/unique.rule';

// decorator function
export function IsUnique(options: IsUniqueType, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}

import {Column, Entity, ObjectId, ObjectIdColumn} from 'typeorm';
import {IsInt, IsEmail, IsString, IsNotEmpty, MinLength, IsArray, IsEnum} from 'class-validator';
import {IsUnique} from '../../auth/decorator/isUnique.decorator';
import {Status} from 'src/common/const';

export class OtpDto {
  @IsString()
  otp: string;
  @IsEnum(Status)
  status: number;
  expiresAt: Date;
}
@Entity()
export class User {
  @IsNotEmpty()
  @ObjectIdColumn()
  _id: ObjectId;

  @IsNotEmpty()
  @IsUnique({tableName: 'User', column: 'email'})
  @IsEmail(undefined, {message: 'Email is invalid'})
  @Column()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Column()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  lastName: string;

  @IsString()
  @Column()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  birthday: string;

  @IsNotEmpty()
  @IsArray()
  @Column()
  roles: string[];

  @IsInt({message: 'Point is number'})
  @Column({default: 0})
  point: number;

  @Column({default: ''})
  accessToken: string;

  @Column(() => OtpDto)
  otp: OtpDto;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'timestamp', default: null, nullable: true})
  updatedAt: Date;
}

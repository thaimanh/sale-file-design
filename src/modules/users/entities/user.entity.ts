import {Column, Entity, ObjectId, ObjectIdColumn} from 'typeorm';
import {IsInt, Length, IsEmail, IsString, IsNotEmpty} from 'class-validator';
import {IsUnique} from '../../../decorator/isUnique.decorator';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @IsNotEmpty()
  @IsUnique({tableName: 'User', column: 'email'})
  @IsEmail(undefined, {message: 'Email is invalid'})
  @Column()
  email: string;

  @IsNotEmpty()
  @Length(1, 8, {message: 'Password length must be at least 8 words'})
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
  @IsInt({message: 'Role is number'})
  @Column()
  role: number;

  @IsInt({message: 'Point is number'})
  @Column({default: 0})
  point: number;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'timestamp', default: null, nullable: true})
  updatedAt: Date;
}

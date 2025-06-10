import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone_number: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInAdminDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
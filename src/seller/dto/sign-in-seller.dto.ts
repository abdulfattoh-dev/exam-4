import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignInSellerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    @IsNotEmpty()
    password: string;
}

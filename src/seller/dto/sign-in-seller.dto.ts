import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInSellerDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

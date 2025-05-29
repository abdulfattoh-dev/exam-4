import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInCustomerDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

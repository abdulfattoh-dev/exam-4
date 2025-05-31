import { IsEmail, IsNotEmpty } from "class-validator";

export class ConfirmSignInSellerDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp: string | number;
}

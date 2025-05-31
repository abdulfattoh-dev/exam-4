import { IsEmail, IsNotEmpty } from "class-validator";

export class ConfirmSignInAdminDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp: string | number;
}

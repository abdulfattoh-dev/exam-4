import { IsNotEmpty, IsNumber, IsString, IsDecimal, IsPhoneNumber } from "class-validator";

export class CreateOrderDto {
    // @IsNotEmpty()
    // @IsNumber()
    // user_id: number

    @IsNotEmpty()
    @IsString()
    items: string

    @IsNotEmpty()
    @IsDecimal()
    total_price: number

    @IsNotEmpty()
    @IsString()
    address: string


    @IsNotEmpty()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsPhoneNumber('UZ')
    phoneNumber: string

    @IsNotEmpty()
    @IsString()
    delivery: string    
}

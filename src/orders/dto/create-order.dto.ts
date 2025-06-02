import { IsNotEmpty, IsNumber, IsString, IsDecimal, IsPhoneNumber } from "class-validator";

export class CreateOrderDto {
    // @IsNotEmpty()
    // @IsNumber()
    // user_id: number

    @IsString()
    @IsNotEmpty()
    items: string

    @IsNumber()
    @IsNotEmpty()
    total_price: number

    @IsString()
    @IsNotEmpty()
    address: string


    @IsString()
    @IsNotEmpty()
    city: string

    @IsPhoneNumber('UZ')
    @IsNotEmpty()
    phoneNumber: string

    @IsString()
    delivery: string  
    
    @IsString()
    @IsNotEmpty()
    status: string
}

import { IsNotEmpty, IsString, IsDecimal, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
    
    @IsNumber()
    @IsNotEmpty()
    seller_id: number;
 

    @IsNumber()
    @IsNotEmpty()
    category_id: number;


}

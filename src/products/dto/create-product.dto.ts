import { IsNotEmpty, IsString, IsDecimal, IsNumber } from "class-validator";

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsString()
    description: string;

    @IsDecimal()
    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

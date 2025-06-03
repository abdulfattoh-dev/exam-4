import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    image: string

    // @IsNumber()
    // @IsNotEmpty()
    // seller_id: number

    // @IsNumber()
    // @IsNotEmpty()
    // category_id: number
}

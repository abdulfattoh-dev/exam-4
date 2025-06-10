import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  seller_id: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  category_id: number;
}

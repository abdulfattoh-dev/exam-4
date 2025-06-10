import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  category_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  seller_id: number;
}

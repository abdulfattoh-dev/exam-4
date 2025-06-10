import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBasketDto {
  @IsNumber()
  @IsNotEmpty()
  customer_id: number;

  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

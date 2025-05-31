import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderItemDto  {
    @IsNumber()
    @IsOptional()
    order_id: number;


    @IsNumber()
    @IsOptional()
    product_id: number;


    @IsNumber()
    @IsOptional()
    quantity: number;
}

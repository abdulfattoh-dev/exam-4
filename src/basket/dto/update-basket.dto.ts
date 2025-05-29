import { PartialType } from '@nestjs/mapped-types';
import { CreateBasketDto } from './create-basket.dto';
import {  IsNumber, IsOptional } from 'class-validator';

export class UpdateBasketDto  {
       @IsNumber()
        @IsOptional()
        user_id: number;
    
    
        @IsOptional()
        @IsNumber()
        product_id: number;
    
    
        @IsOptional()
        @IsNumber()
        quantity: number;
}



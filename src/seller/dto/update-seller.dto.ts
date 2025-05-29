import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/enum';

export class UpdateSellerDto extends PartialType(CreateSellerDto) {
    @IsOptional()
    @IsEnum([Status.ACTIVE, Status.INACTIVE])
    status?: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from './create-wallet.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
    @IsOptional()
    @IsString()
    type: string


    @IsOptional()
    @IsString()
    card: string
}

import { IsNumber, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  order_id: number;

  @IsNumber()
  wallet_id: number;

  @IsNumber()
  amount: number;

  @IsEnum(['success', 'failed'])
  status: 'success' | 'failed';
}

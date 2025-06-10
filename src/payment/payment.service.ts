import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}

  async create(dto: CreatePaymentDto): Promise<Payment> {
    return this.paymentModel.create({ ...dto });
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentModel.findAll({ include: { all: true } });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentModel.findByPk(id, {
      include: { all: true },
    });
    if (!payment) throw new NotFoundException('To‘lov topilmadi');
    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    return payment.update(dto);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);
    await payment.destroy();
  }
}

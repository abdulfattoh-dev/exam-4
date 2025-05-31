import { Module } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { OrderItem } from './model/order-item.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([OrderItem])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}

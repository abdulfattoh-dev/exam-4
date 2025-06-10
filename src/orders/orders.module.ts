import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { Basket } from 'src/basket/model/basket.model';
import { OrderItem } from 'src/order-item/model/order-item.model';
import { Product } from 'src/products/models/product.model';

@Module({
  imports: [SequelizeModule.forFeature([Order, Basket, OrderItem, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

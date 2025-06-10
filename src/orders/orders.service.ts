import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { catchError } from 'src/utils/catch-error';
import { Basket } from 'src/basket/model/basket.model';
import { Sequelize } from 'sequelize-typescript';
import { OrderItem } from 'src/order-item/model/order-item.model';
import { Product } from 'src/products/models/product.model';
import { successRes } from 'src/helpers/success-response';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(Basket) private basketModel: typeof Basket,
    @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
    @InjectModel(Product) private productModel: typeof Product,
    private readonly sequelize: Sequelize,
  ) {}
  async create(createOrderDto: CreateOrderDto): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const newOrder = await this.orderModel.create(
        { ...createOrderDto },
        { transaction },
      );
      const baskets = await this.basketModel.findAll({
        where: { customerId: createOrderDto.customer_id },
        transaction,
      });

      if (!baskets) {
        throw new NotFoundException('Basket is empty');
      }

      for (const basket of baskets) {
        const { productId, quantity } = basket;
        const product = await this.productModel.findOne({
          where: { id: productId },
          transaction,
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        if (product.quantity < quantity) {
          throw new BadRequestException('Insufficient product quantity');
        }

        product.quantity -= quantity;
        await product.save({ transaction });
        await this.orderItemModel.create(
          {
            orderId: newOrder.id,
            productId,
            quantity,
          },
          {
            transaction,
          },
        );
        await this.basketModel.destroy({
          where: { id: basket.id },
          transaction,
        });
      }

      await transaction.commit();

      return successRes(newOrder);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const orders = await this.orderModel.findAll();

      return successRes(orders);
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const order = await this.orderModel.findByPk(id);
      if (!order) {
        throw new NotFoundException(`Order id not found: ${id}`);
      }

      return successRes(order);
    } catch (error) {
      return catchError(error);
    }
  }

  // async update(id: number, updateOrderDto: UpdateOrderDto): Promise<object> {
  //   try {
  //     const orderId = await this.orderModel.findByPk(id);
  //     if (!orderId) {
  //       throw new NotFoundException(`Order id not found: ${id}`);
  //     }
  //     const updateOrder = await this.orderModel.update(updateOrderDto, {
  //       where: { id },
  //       returning: true,
  //     });
  //     return {
  //       statusCode: 200,
  //       message: 'success',
  //       data: updateOrder,
  //     };
  //   } catch (error) {
  //     return catchError(error);
  //   }
  // }

  // async remove(id: number): Promise<object> {
  //   try {
  //     const orderId = await this.orderModel.findByPk(id);
  //     if (!orderId) {
  //       throw new NotFoundException(`Order id not found: ${id}`);
  //     }
  //     await this.orderModel.destroy({ where: { id } });
  //     return {
  //       statusCode: 200,
  //       message: 'success',
  //       data: { data: {} },
  //     };
  //   } catch (error) {
  //     return catchError(error);
  //   }
  // }
}

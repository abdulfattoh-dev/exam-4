import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { catchError } from 'src/utils/catch-error';


@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order) private orderModel: typeof Order) {}
  async create(createOrderDto: CreateOrderDto): Promise<object> {
    try {
      const newOrder = await this.orderModel.create({ ...createOrderDto });
      return {
        statusCode: 201,
        message: 'success',
        data: newOrder
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const orders = await this.orderModel.findAll();
      if (!orders?.length) {
        throw new NotFoundException('Orders not founds');
      }
      return {
        statusCode: 200,
        message: 'success',
        data: orders
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const orderId = await this.orderModel.findByPk(id);
      if (!orderId) {
        throw new NotFoundException(`Order id not found: ${id}`);
      }
      return {
        statusCode: 200,
        message: 'success',
        data: orderId,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<object> {
    try {
      const orderId = await this.orderModel.findByPk(id);
      if (!orderId) {
        throw new NotFoundException(`Order id not found: ${id}`);
      }
      const updateOrder = await this.orderModel.update(updateOrderDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: 200,
        message: 'success',
        data: updateOrder,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const orderId = await this.orderModel.findByPk(id);
      if (!orderId) {
        throw new NotFoundException(`Order id not found: ${id}`);
      }
      await this.orderModel.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'success',
        data: { data: {} },
      };
    } catch (error) {
      return catchError(error);
    }
  }
}

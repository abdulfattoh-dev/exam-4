import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from './model/order-item.model';
import { catchError } from 'src/utils/catch-error';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItem) private readonly orderItemModel: typeof OrderItem
  ){}
  async create(createOrderItemDto: CreateOrderItemDto): Promise<object> {
    try {
      const newOrderItem = await this.orderItemModel.create({...createOrderItemDto})
      return{
        statusCode: 201,
        message: 'success',
        data: newOrderItem
      }
    } catch (error) {
      return catchError(error)
    }
    
  }

  async findAll(): Promise<object> {
    try{
      const orderItems = await this.orderItemModel.findAll();
      if(!orderItems?.length){
        throw new NotFoundException('orderItem not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: orderItems
      }
    } catch(error){
      return catchError(error)
    }
            
    
  }

  async findOne(id: number): Promise<object> {
    try {
      const orderItems = await this.orderItemModel.findByPk(id);
      if(!orderItems){
        throw new NotFoundException('orderItem id not found')
      }
      return{
        statusCode: 200,
        message: 'success',
        data: orderItems
      }
      
    } catch (error) {
      return catchError(error)
      
    }
    
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<object> {
    try {
      const orderItems = await this.orderItemModel.findByPk(id);
      if(!orderItems){
        throw new NotFoundException('orderItem id not found')
      }

      const orderItem = await this.orderItemModel.update(updateOrderItemDto,{ where: {id}, returning: true });
      return {
        statusCode: 200,
        message: 'success',
        data: orderItem
      }
    } catch (error) {
      return catchError(error)
      
    }
    
  }

  async remove(id: number): Promise<object> {
    try {
      const orderItems = await this.orderItemModel.findByPk(id);
      if (!orderItems){
        throw new NotFoundException('OrderItem id not found')
      }
      await this.orderItemModel.destroy({where: {id}});
      return {
        statusCode: 200,
        message: 'success',
        data: {}
      }
      
    } catch (error) {
      return catchError(error)
    }
    
  }
}

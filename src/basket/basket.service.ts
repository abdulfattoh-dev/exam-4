import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Basket } from './model/basket.model';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket) private basketModel: typeof Basket
  ){}
  async create(createBasketDto: CreateBasketDto) {
    try {
      const newBasket = await this.basketModel.create({...createBasketDto})
      return{
        statusCode: 201,
        message: 'success',
        data: newBasket
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      
    }
  }

  async findAll() {
    try {
      const baskets = await this.basketModel.findAll();
      if(!baskets?.length){
        throw new NotFoundException('baskets not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: baskets
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      
    }
    
  }

  async findOne(id: number) {
    try {
      const baskets = await this.basketModel.findByPk(id);
      if(!baskets){
        throw new NotFoundException('Basket id not found')
      }
      return{
        statusCode: 200,
        message: 'success',
        data: baskets
      }
      
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      
    }
    
  }

  async update(id: number, updateBasketDto: UpdateBasketDto) {
    try {
      const baskets = await this.basketModel.findByPk(id);
      if(!baskets){
        throw new NotFoundException('Basket id not found')
      }

      const basket = await this.basketModel.update(updateBasketDto,{ where: {id}, returning: true });
      return {
        statusCode: 200,
        message: 'success',
        data: basket
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      
    }
  }

  async remove(id: number) {
    try {
      const baskets = await this.basketModel.findByPk(id);
      if (!baskets){
        throw new NotFoundException('Basket id not found')
      }
      await this.basketModel.destroy({where: {id}});
      return {
        statusCode: 200,
        message: 'success',
        data: {}
      }
      
    } catch (error) {
      throw new InternalServerErrorException(error.message)
      
    }
  }
}

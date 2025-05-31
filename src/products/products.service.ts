import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { catchError } from 'src/utils/catch-error';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async create(createProductDto: CreateProductDto): Promise<object> {
    try {
      const product = await this.productModel.create({ ...createProductDto });
      return {
        statusCode: 201,
        message: 'success',
        data: product,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const products = await this.productModel.findAll();
      if(!products?.length) {
        throw new NotFoundException('Products not found');
      }
      return {
        statusCode: 200,
        message: 'success',
        data: products,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const product = await this.productModel.findByPk(id);
      if (!product) {
        throw new NotFoundException('Product id not found');
      }
      return {
        statusCode: 200,
        message: 'success',
        data: product,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<object> {
    try {
      const productId = await this.productModel.findByPk(id);
      if(!productId) {
        throw new NotFoundException('product id not found')
      }
      const product = await this.productModel.update(updateProductDto, {
        where: { id },
        returning: true,
      });
      return {
        statusCode: 200,
        message: 'success',
        data: product,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const productId = await this.productModel.findByPk(id);
      if(!productId) {
        throw new NotFoundException('product id not found')
      }
      await this.productModel.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'success',
        data: { data: {} },
      };
    } catch (error) {
      console.log(error)
      return catchError(error);
    }
  }
}

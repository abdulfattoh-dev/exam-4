import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { catchError } from 'src/utils/catch-error';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileService } from 'src/file/file.service';
import { console } from 'inspector';
import { ImagesOfAdmin } from './models/image-of-product';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(ImagesOfAdmin) private imageModel: typeof ImagesOfAdmin,
    private readonly sequelize: Sequelize,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      const { seller_id, name } = createProductDto;
      const existing = await this.productModel.findOne({
        where: { seller_id, name },
        transaction,
      });
      if (existing) {
        throw new ConflictException('Product name already exists');
      }

      const product = await this.productModel.create({
        ...createProductDto,
        transaction,
      });
      const imageUrl: string[] = [];
      if (files && files.length > 0) {
        for (let file of files) {
          imageUrl.push(await this.fileService.createFile(file));
        }
        const images = imageUrl.map((image: string) => {
          return {
            image_url: image,
            product_id: product.dataValues.id,
          };
        });
        await this.imageModel.bulkCreate(images, { transaction });
      }
      await transaction.commit();
      const findProduct = await this.productModel.findOne({
        where: { name },
        include: { all: true },
      });
      return {
        statusCode: 201,
        message: 'success',
        data: findProduct,
      };
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const products = await this.productModel.findAll({
        include: { all: true },
      });
      if (!products?.length) {
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
      const product = await this.productModel.findByPk(id, {
        include: { all: true },
      });
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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<object> {
    try {
      const productId = await this.productModel.findByPk(id);
      if (!productId) {
        throw new NotFoundException('product id not found');
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
      if (!productId) {
        throw new NotFoundException('product id not found');
      }
      await this.productModel.destroy({ where: { id } });
      return {
        statusCode: 200,
        message: 'success',
        data: { data: {} },
      };
    } catch (error) {
      console.log(error);
      return catchError(error);
    }
  }
}

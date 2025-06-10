import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product.dto';
import { catchError } from 'src/utils/catch-error';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileService } from 'src/file/file.service';
import { successRes } from 'src/helpers/success-response';
import { ImagesOfProduct } from './models/images-of-product.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productModel: typeof Product,
    @InjectModel(ImagesOfProduct) private imageOfProduct: typeof ImagesOfProduct,
    private readonly sequelize: Sequelize,
    private readonly fileService: FileService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files?: Express.Multer.File[],
  ): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.productModel.create(
        { ...createProductDto },
        { transaction },
      );

      let imagesUrl: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          imagesUrl.push(await this.fileService.createFile(file));
        }

        const images = imagesUrl.map((image: string) => {
          return {
            image_url: image,
            product_id: product.dataValues?.id,
          };
        });

        await this.imageOfProduct.bulkCreate(images, { transaction });
      }

      await transaction.commit();

      const findProduct = await this.productModel.findByPk(product.id, {
        include: { all: true },
      });

      return successRes(findProduct, 201);
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
    files?: Express.Multer.File[],
  ): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.productModel.findByPk(id, { transaction });

      if (!product) {
        throw new NotFoundException('Product id not found');
      }

      await this.productModel.update(
        { ...updateProductDto },
        { where: { id }, transaction },
      );

      if (files && files.length > 0) {
        const oldImages = await this.imageOfProduct.findAll({
          where: { product_id: id },
          transaction,
        });

        for (const img of oldImages) {
          if (
            img.image_url &&
            (await this.fileService.existFile(img.image_url))
          ) {
            await this.fileService.deleteFile(img.image_url);
          }
        }

        await this.imageOfProduct.destroy({
          where: { product_id: id },
          transaction,
        });

        const imagesUrl: string[] = [];

        for (const file of files) {
          imagesUrl.push(await this.fileService.createFile(file));
        }

        const images = imagesUrl.map((image: string) => ({
          image_url: image,
          product_id: id,
        }));

        await this.imageOfProduct.bulkCreate(images, { transaction });
      }

      await transaction.commit();

      const updatedProduct = await this.productModel.findByPk(id, {
        include: { all: true },
      });

      return successRes(updatedProduct);
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    const transaction = await this.sequelize.transaction();
    try {
      const product = await this.productModel.findByPk(id, { transaction });
      if (!product) {
        throw new NotFoundException('product id not found');
      }

      const images = await this.imageOfProduct.findAll({
        where: { product_id: id },
        transaction,
      });

      for (const img of images) {
        if (
          img.image_url &&
          (await this.fileService.existFile(img.image_url))
        ) {
          await this.fileService.deleteFile(img.image_url);
        }
      }

      await this.imageOfProduct.destroy({
        where: { product_id: id },
        transaction,
      });
      await this.productModel.destroy({ where: { id }, transaction });
      await transaction.commit();

      return successRes({ message: 'Product deleted successfully' });
    } catch (error) {
      await transaction.rollback();
      return catchError(error);
    }
  }
}

import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { FileModule } from 'src/file/file.module';
import { ImagesOfProduct } from './models/images-of-product.model';

@Module({
  imports: [SequelizeModule.forFeature([Product, ImagesOfProduct]), FileModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

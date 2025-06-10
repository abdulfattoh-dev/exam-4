import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { FileModule } from 'src/file/file.module';
import { ImagesOfAdmin } from './models/image-of-product';

@Module({
  imports: [SequelizeModule.forFeature([Product, ImagesOfAdmin]), FileModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

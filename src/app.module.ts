import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import config from './config';
import { Admin } from './admin/models/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { Category } from './categories/models/category.model';
import { BasketModule } from './basket/basket.module';
import { OrderItemModule } from './order-item/order-item.module';
import { Basket } from './basket/model/basket.model';
import { OrderItem } from './order-item/model/order-item.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: config.PG_HOST,
      port: config.PG_PORT,
      username: config.PG_USER,
      password: config.PG_PASS,
      database: config.PG_DB,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      models: [Category, Basket, OrderItem],
      
    }),
    JwtModule.register({
      global: true
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    AdminModule,
    BasketModule,
    OrderItemModule
  ]
})
export class AppModule {}

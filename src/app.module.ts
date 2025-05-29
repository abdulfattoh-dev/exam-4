import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SequelizeModule } from '@nestjs/sequelize';
import config from './config';
import { Product } from './products/models/product.model';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/models/wallet.model';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [4
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: config.PG_HOST,
      port: config.PG_PORT,
      username: config.PG_USER,
      password: config.PG_PASS,
      database: config.PG_DB,
      synchronize: true,
      logging: false,
      autoLoadModels: true,
      models: [Product, Wallet]
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    WalletModule,
    OrdersModule]
})
export class AppModule { }

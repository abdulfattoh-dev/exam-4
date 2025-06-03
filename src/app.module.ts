import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminModule } from './admin/admin.module';
import config from './config';
import { Admin } from './admin/models/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from './customer/customer.module';
import { SellerModule } from './seller/seller.module';
import { Customer } from './customer/models/customer.model';
import { Seller } from './seller/models/seller.model';
import { Product } from './products/models/product.model';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/models/wallet.model';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/models/order.model';
import { MailModule } from './mail/mail.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PaymentModule } from './payment/payment.module';
import { Category } from './categories/models/category.model';
import { BasketModule } from './basket/basket.module';
import { OrderItemModule } from './order-item/order-item.module';
import { Basket } from './basket/model/basket.model';
import { OrderItem } from './order-item/model/order-item.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';

@Module({
  imports: [
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
      models: [Admin, Customer, Seller, Product, Wallet, Order, Category, Basket, OrderItem]
    }),
    JwtModule.register({
      global: true
    }),
    CacheModule.register({
      isGlobal: true
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads'
    }),
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    AdminModule,
    CustomerModule,
    SellerModule,
    WalletModule,
    OrdersModule,
    PaymentModule,
    MailModule,
    BasketModule,
    OrderItemModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule { }

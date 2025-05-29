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
import { CustomerModule } from './customer/customer.module';
import { SellerModule } from './seller/seller.module';
import { Customer } from './customer/models/customer.model';
import { Seller } from './seller/models/seller.model';
import { Product } from './products/models/product.model';
import { WalletModule } from './wallet/wallet.module';
import { Wallet } from './wallet/models/wallet.model';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/models/order.model';

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
            models: [Admin, Customer, Seller, Product, Wallet, Order]
        }),
        JwtModule.register({
            global: true
        }),
        ProductsModule,
        CategoriesModule,
        ReviewsModule,
        AdminModule,
        CustomerModule,
        SellerModule,
        WalletModule,
        OrdersModule
    ]
})
export class AppModule { }

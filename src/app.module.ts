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
      models: [Admin]
    }),
    JwtModule.register({
      global: true
    }),
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    AdminModule
  ]
})
export class AppModule { }

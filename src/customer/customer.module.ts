import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Customer } from './models/customer.model';
import { TokenService } from 'src/utils/generate-token';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Customer]),
    MailModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, TokenService],
})
export class CustomerModule { }

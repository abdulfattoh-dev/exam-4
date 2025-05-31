import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Seller } from './models/seller.model';
import { TokenService } from 'src/utils/generate-token';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Seller]),
    MailModule
  ],
  controllers: [SellerController],
  providers: [SellerService, TokenService],
})
export class SellerModule { }

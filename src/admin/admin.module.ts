import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';
import { TokenService } from 'src/utils/generate-token';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [SequelizeModule.forFeature([Admin]), MailModule],
  controllers: [AdminController],
  providers: [AdminService, TokenService],
})
export class AdminModule {}

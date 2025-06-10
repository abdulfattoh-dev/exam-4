import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SignInSellerDto } from './dto/sign-in-seller.dto';
import { Response } from 'express';
import { ConfirmSignInSellerDto } from './dto/confirm-sign-in-seller.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CheckRoles } from 'src/decorators/role.decorator';
import { AdminRoles, UserRoles } from 'src/enum';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInSellerDto: SignInSellerDto) {
    return this.sellerService.signIn(signInSellerDto);
  }

  @Post('confirm-sign-in')
  async confirmSignIn(
    @Body() confirmSignInSellerDto: ConfirmSignInSellerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.sellerService.confirmSignIn(confirmSignInSellerDto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.CUSTOMER, UserRoles.SELLER)
  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.CUSTOMER, UserRoles.SELLER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.SELLER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}

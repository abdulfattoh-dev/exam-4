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
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SignInCustomerDto } from './dto/sign-in-customer.dto';
import { Response } from 'express';
import { ConfirmSignInCustomerDto } from './dto/confirm-sign-in-customer.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Post('sign-in')
  async signIn(@Body() signInCustomerDto: SignInCustomerDto) {
    return this.customerService.signIn(signInCustomerDto);
  }

  @Post('confirm-sign-in')
  async confirmSignIn(
    @Body() confirmSignInCustomerDto: ConfirmSignInCustomerDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.customerService.confirmSignIn(confirmSignInCustomerDto, res);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }
}

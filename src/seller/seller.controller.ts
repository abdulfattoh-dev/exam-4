import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { SignInSellerDto } from './dto/sign-in-seller.dto';
import { Response } from 'express';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) { }

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @Post()
  async signIn(@Body() signInSellerDto: SignInSellerDto, @Res({ passthrough: true }) res: Response) {
    return this.sellerService.signIn(signInSellerDto, res);
  }

  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(+id);
  }
}

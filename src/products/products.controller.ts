import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from 'src/pipes/image-validation-pipe';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CheckRoles } from 'src/decorators/role.decorator';
import { AdminRoles, UserRoles } from 'src/enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.SELLER)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles(new ImageValidationPipe()) file?: Express.Multer.File[],
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.SELLER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.SELLER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}

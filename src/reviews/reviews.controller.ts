import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CheckRoles } from 'src/decorators/role.decorator';
import { AdminRoles, UserRoles } from 'src/enum';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard,)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.CUSTOMER, UserRoles.SELLER)
  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: number) {
    return this.reviewService.findByProduct(productId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.CUSTOMER)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @CheckRoles(AdminRoles.SUPERADMIN, AdminRoles.ADMIN, UserRoles.CUSTOMER)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewService.remove(id);
  }
}

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewService.remove(id);
  }
}

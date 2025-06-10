import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './models/review.model';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review) private reviewModel: typeof Review) {}

  async create(dto: CreateReviewDto) {
    try {
      return await this.reviewModel.create({ ...dto });
    } catch (error) {
      console.error('Error creating review:', error.message);
      throw new InternalServerErrorException(
        'Review yaratishda xatolik yuz berdi',
      );
    }
  }

  async findAll(): Promise<Review[]> {
    try {
      return await this.reviewModel.findAll({ include: { all: true } });
    } catch (error) {
      console.error('Error fetching all reviews:', error.message);
      throw new InternalServerErrorException(
        'Reviewlarni olishda xatolik yuz berdi',
      );
    }
  }

  async findByProduct(productId: number): Promise<Review[]> {
    try {
      return await this.reviewModel.findAll({
        where: { product_id: productId },
        include: { all: true },
      });
    } catch (error) {
      console.error('Error fetching reviews by product:', error.message);
      throw new InternalServerErrorException(
        'Ushbu mahsulot uchun reviewlarni olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    try {
      const review = await this.reviewModel.findByPk(id);
      if (!review) throw new NotFoundException('Review topilmadi');
      return await review.update(dto);
    } catch (error) {
      console.error('Error updating review:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Reviewni yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const review = await this.reviewModel.findByPk(id);
      if (!review) throw new NotFoundException('Review topilmadi');
      await review.destroy();
    } catch (error) {
      console.error('Error removing review:', error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Reviewni o‘chirishda xatolik yuz berdi',
      );
    }
  }
}

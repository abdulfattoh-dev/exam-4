import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';

0
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryModel: typeof Category
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = await this.categoryModel.create({ ...createCategoryDto });
    return {
      statusCode: 201,
      message: 'success',
      data: newCategory
    }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryModel.findAll();
      if(!categories?.length){
        throw new NotFoundException('categories not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: categories
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }

  }

  async findOne(id: number) {
    try {
      const categories = await this.categoryModel.findByPk(id);
      if(!categories){
        throw new NotFoundException('Category id not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: categories
      }

    } catch (error) {
      throw new InternalServerErrorException(error.message)

    }

  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const categories = await this.categoryModel.findByPk(id);
      if(!categories){
        throw new NotFoundException('Category id not found')
      }

      const category = await this.categoryModel.update(updateCategoryDto, { where: { id }, returning: true });
      return {
        statusCode: 200,
        message: 'success',
        data: category
      }

    } catch (error) {
      throw new InternalServerErrorException(error.message)

    }
  }

  async remove(id: number) {
  try {
    const categories = await this.categoryModel.findByPk(id);
    if(!categories){
      throw new NotFoundException('Category id not found')
    }

    await this.categoryModel.destroy({ where: { id } });
    return {
      statusCode:200,
      message: 'success',
      data: {}
    };

  } catch (error) {
    throw new InternalServerErrorException(error.message)

  }

}
}

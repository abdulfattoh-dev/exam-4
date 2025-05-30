import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { catchError } from 'src/utils/catch-error';

0
@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoryModel: typeof Category
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<object> {
    try {
      const newCategory = await this.categoryModel.create({ ...createCategoryDto });
    return {
      statusCode: 201,
      message: 'success',
      data: newCategory
    }
    } catch (error) {
      return catchError(error)
    }
  }

  async findAll(): Promise<object>  {
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
      return catchError(error)
    }

  }

  async findOne(id: number): Promise<object> {
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
      return catchError(error)

    }

  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<object> {
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
      return catchError(error)

    }
  }

  async remove(id: number): Promise<object> {
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
    return catchError(error)

  }

}
}

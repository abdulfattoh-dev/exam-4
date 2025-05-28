import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}
  async create(createCategoryDto: CreateCategoryDto) {
    {
      const newCategory = await this.categoryModel.create({ ...createCategoryDto });
      return newCategory;
    }
  }

  async findAll() {
    const categories = await this.categoryModel.findAll();
    return categories
  }

  async findOne(id: number) {
    const categories =await this.categoryModel.findByPk(id);
    return categories
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.update(updateCategoryDto, {where:{id}, returning: true});
    return category
  }

  async remove(id: number) {
    await this.categoryModel.destroy({where: {id}});
    return {data: {}};
  }
}

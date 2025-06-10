import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Optional()
  @IsString()
  name: string;

  @Optional()
  @IsString()
  description: string;
}

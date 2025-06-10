import { Type } from 'class-transformer';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/categories/models/category.model';
import { Review } from 'src/reviews/models/review.model';
import { Seller } from 'src/seller/models/seller.model';
import { ImagesOfProduct } from './images-of-product.model';

@Table({ tableName: 'product' })
export class Product extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @ForeignKey(() => Seller)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  seller_id: number;

  @BelongsTo(() => Seller, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  seller: Seller;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  category_id: number;

  @BelongsTo(() => Category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  category: Category;

  @HasMany(() => ImagesOfProduct, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  images: ImagesOfProduct[];

  @HasMany(() => Review)
  reviews: Review;
}

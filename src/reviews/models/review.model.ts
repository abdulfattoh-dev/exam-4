import { Table, Column, Model, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/models/user.model';
import { Product } from 'src/products/models/product.model';

@Table({ tableName: 'reviews' })
export class Review extends Model<Review> {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  user_id: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  product_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  comment: string;

  @Column({ type: DataType.INTEGER })
  rating: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}

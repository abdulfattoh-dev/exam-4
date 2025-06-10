import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Customer } from 'src/customer/models/customer.model';
import { Product } from 'src/products/models/product.model';

@Table({ tableName: 'reviews' })
export class Review extends Model {
  @ForeignKey(() => Customer)
  @Column({ type: DataType.INTEGER })
  user_id: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  product_id: number;

  @Column({ type: DataType.STRING })
  comment?: string;

  @Column({ type: DataType.INTEGER })
  rating: number;

  @BelongsTo(() => Customer)
  user: Customer;

  @BelongsTo(() => Product)
  product: Product;
}

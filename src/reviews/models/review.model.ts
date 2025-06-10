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
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id: number;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product_id: number;

  @Column({
    type: DataType.STRING,
  })
  comment?: string;

  @Column({
    type: DataType.ENUM('1', '2', '3', '4', '5'),
    allowNull: false,
  })
  rating: string;

  @BelongsTo(() => Customer)
  customer: Customer;

  @BelongsTo(() => Product)
  product: Product;
}

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from 'src/products/models/product.model';
// import { User } from 'src/users/models/user.model';

@Table({ tableName: 'baskets' })
export class Basket extends Model {
  //   @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  //   @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  quantity: number;

  // @BelongsTo(() => User)
  // user: User;

  //   @BelongsTo(() => Product)
  //   product: Product;
}

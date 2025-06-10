import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'orders' })
export class Order extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total_price: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.ENUM('yourself', 'delivery'),
    allowNull: false,
  })
  delivery: string;

  @Column({
    type: DataType.ENUM(
      'Accepted',
      'Preparing',
      'Delivering',
      'Delivered',
      'Closed',
    ),
    allowNull: false,
    defaultValue: 'Accepted',
  })
  status: string;
}

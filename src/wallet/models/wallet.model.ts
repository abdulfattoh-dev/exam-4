import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Customer } from 'src/customer/models/customer.model';

@Table({ tableName: 'wallet' })
export class Wallet extends Model {
  @ForeignKey(() => Customer)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  customer_id: number;
  @BelongsTo(() => Customer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  customer: Customer;

  @Column({
    type: DataType.ENUM('Uzcard', 'Humo', 'Visa', 'MasterCard'),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  card: string;
}

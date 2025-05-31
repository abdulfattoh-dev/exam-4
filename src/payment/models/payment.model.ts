import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Order } from 'src/orders/models/order.model';
import { Wallet } from 'src/wallet/models/wallet.model';

@Table({ tableName: 'payments' })
export class Payment extends Model {
  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  order_id: number;

  @ForeignKey(() => Wallet)
  @Column({ type: DataType.INTEGER, allowNull: false })
  wallet_id: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount: number;

  @Column({ type: DataType.ENUM('success', 'failed'), allowNull: false })
  status: 'success' | 'failed';

  @BelongsTo(() => Order)
  order: Order;

  @BelongsTo(() => Wallet)
  wallet: Wallet;
}

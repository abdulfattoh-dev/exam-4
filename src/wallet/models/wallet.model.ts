import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'wallet' })
export class Wallet extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user_id: number;

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

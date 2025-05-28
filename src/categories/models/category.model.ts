import { Column, DataType, Table, Model } from 'sequelize-typescript';

@Table({ tableName: 'category' })
export class Category extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    
  })
  description: string;
}

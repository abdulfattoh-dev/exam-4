import { Column, DataType, Table, Model, HasMany } from 'sequelize-typescript';
import { Product } from 'src/products/models/product.model';

@Table({ tableName: 'category' })
export class Category extends Model {
  
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    
  })
  description: string;

  @HasMany(()=> Product)
  products: Product;
}

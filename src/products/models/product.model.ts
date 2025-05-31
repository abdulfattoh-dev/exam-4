import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Seller } from "src/seller/models/seller.model";


@Table ({tableName: 'product'})
export class Product extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name: string

    @Column({
        type: DataType.STRING,
    })
    description: string

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    price: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    quantity: number


    // @ForeignKey(() => Seller)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: false
    // })
    // seller_id: number

    
    // @ForeignKey(() => Category)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: false
    // })
    // category_id: number;
    // @BelongsTo(() => Category)

    // @Column({
    //     type: DataType.STRING,
    //     allowNull: false 
    // })
    // image: string
}

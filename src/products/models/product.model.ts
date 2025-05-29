import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";


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

    // @ForeignKey(() => Category)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: false
    // })
    // category_id: number;
    // @BelongsTo(() => Category)

    // @ForeignKey(() => User)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: false
    // })
    // user_id: number

    // @Column({
    //     type: DataType.STRING,
    //     allowNull: false 
    // })
    // image: string
}

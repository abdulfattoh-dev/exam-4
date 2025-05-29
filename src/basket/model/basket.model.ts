import { Column, DataType, Table, Model } from "sequelize-typescript";

@Table({ tableName: 'basket' })
export class Basket extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,

    })
    user_id: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    product_id: number

    @Column({
        type: DataType.NUMBER,
        allowNull: false,
    })

    quantity: number

}

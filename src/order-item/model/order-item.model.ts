import { Column, Table, DataType, Model} from "sequelize-typescript";

@Table({ tableName: 'orderItem'})
export class OrderItem extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,

    })
    order_id: number


    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    product_id: number


    @Column({
        type: DataType.INTEGER,
        allowNull: false,

    })
    quantity: number

}

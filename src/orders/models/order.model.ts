import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Customer } from "src/customer/models/customer.model";

@Table({tableName: 'orders'})
export class Order extends Model{

    @ForeignKey(() => Customer)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    customer_id: number

    @BelongsTo(() => Customer, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    customer: Customer;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    items: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    total_price: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    address: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    city: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    }) 
    phoneNumber: string

    @Column({
        type: DataType.ENUM('mail', 'delivery'),
    })
    delivery: string


    @Column({
        type: DataType.ENUM('Accepted Order', 'Preparing', 'Delivering', 'Delivered', 'Closed'),
        allowNull: false
    })
    status: string
}

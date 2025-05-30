import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({tableName: 'orders'})
export class Order extends Model{
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: false
    // })
    // user_id: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    items: string

    @Column({
        type: DataType.DECIMAL,
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

    // @Column({
    //     type: DataType.STRING,
    // })

    @Column({
        type: DataType.ENUM('Mail', 'delivery'),
        allowNull: false
    })
    delivery: string


    @Column({
        type: DataType.ENUM('Accepted Order', 'Preparing', 'Delivering', 'Delivered', 'Closed')
    })
    status: string
}

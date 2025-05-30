import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Status, UserRoles } from "src/enum";

@Table({ tableName: "users" })
export class Seller extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    full_name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    email: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    phone_number: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    hashed_password: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    address: string;

    @Column({
        type: DataType.ENUM(UserRoles.SELLER, UserRoles.CUSTOMER),
        defaultValue: UserRoles.SELLER
    })
    role: string;

    @Column({
        type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
        defaultValue: Status.ACTIVE
    })
    status: string;
}

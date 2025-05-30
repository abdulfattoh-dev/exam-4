import { Column, DataType, Model, Table } from "sequelize-typescript";
import { AdminRoles, Status } from "src/enum";

@Table({ tableName: "admins" })
export class Admin extends Model {
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
        type: DataType.ENUM(AdminRoles.SUPERADMIN, AdminRoles.ADMIN),
        defaultValue: AdminRoles.ADMIN
    })
    role: string;

    @Column({
        type: DataType.ENUM(Status.ACTIVE, Status.INACTIVE),
        defaultValue: Status.ACTIVE
    })
    status: string;
}

import { Model, Table, Column, DataType, HasMany, BelongsToMany } from "sequelize-typescript";
import Messages from './messages.model';
import Users from "./users.model";
import ChatsUsers from "./chatsusers.model";

@Table({
    tableName: "chats",
})

export default class Chats extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id!: number;

    @Column({
        type: DataType.STRING(255),
        field: "name",
    })
    name?: string;

    @Column({
        type: DataType.BOOLEAN,
        field: "isActive",
        defaultValue: true
    })
    isActive?: boolean;

    @HasMany(() => Messages)
    messages?: Messages[];

    @BelongsToMany(() => Users, () => ChatsUsers)
    users?: Users[];

}

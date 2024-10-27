import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";
import Chats from './chats.model';
import Users from "./users.model";

@Table({
    tableName: "messages",
})

export default class Messages extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
    })
    id!: number;

    @Column({
        type: DataType.STRING(255),
        field: "message",
    })
    message?: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
    })
    userId!: number;

    @ForeignKey(() => Chats)
    @Column({
        type: DataType.INTEGER,
    })
    chatId!: number;
}

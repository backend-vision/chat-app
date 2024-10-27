import { Model, Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Chats from "./chats.model";
import ChatsUsers from "./chatsusers.model";

@Table({
  tableName: "users",
})
export default class Users extends Model {
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
    type: DataType.STRING(255),
    field: "email",
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    field: "password",
    allowNull: false
  })
  password?: string;

  @BelongsToMany(() => Chats, () => ChatsUsers)
  chats?: Chats[];
}

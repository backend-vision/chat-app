import { Model, Table, ForeignKey, Column, DataType } from 'sequelize-typescript';
import Chats from './chats.model';
import Users from './users.model';

@Table({
    tableName: 'chats_users',
})
export default class ChatsUsers extends Model {
    @ForeignKey(() => Chats)
    @Column({
        type: DataType.INTEGER,
    })
    chatId!: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
    })
    userId!: number;
}

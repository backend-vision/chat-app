import { Request, Response } from "express";
import Chats from "../models/chats.model";
import * as dotenv from 'dotenv';
import path from "path";
import { z } from "zod";
import Messages from "../models/messages.model";
import Users from "../models/users.model";
import ChatsUsers from "../models/chatsusers.model";
import { Sequelize } from "sequelize-typescript";
import { Op } from 'sequelize';

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

export default class ChatsController {
    constructor() {
        this.initiateChat = this.initiateChat.bind(this);
        this.getChats = this.getChats.bind(this);
        this.getChatById = this.getChatById.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
    }

    private sendErrorResponse(res: Response, status: number, message: string) {
        return res.status(status).send({ message });
    }

    async initiateChat(req: Request, res: Response) {
        try {

            const { name, userIds } = req.body;
            const chat = await Chats.create({
                name: name,
                isActive: true
            });
            const chatUsers = userIds.map((userId: number) => ({ chatId: chat.id, userId }));
            await ChatsUsers.bulkCreate(chatUsers);

            if (chat) {
                res.status(200).send(chat);
            } else {
                return this.sendErrorResponse(res, 404, "Chat not created.");
            }
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
            }
            this.sendErrorResponse(res, 500, "Some error occurred.");
        }
    }

    async getChats(req: Request, res: Response) {
        try {
            const userId = +(req.query.userId as string);
            if (!userId) {
                return this.sendErrorResponse(res, 401, "Permission Denied.");
            }

            const chats = await Chats.findAll({
                include: [
                    {
                        model: Users,
                        required: true,
                        attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: Messages,
                        required: false,
                    },
                ],
                where: {
                    isActive: true,
                    id: {
                        [Op.in]: Sequelize.literal(`(
                            SELECT "chatId" FROM chats_users WHERE "userId" = ${userId}
                        )`)
                    }
                }
            });
            if (chats && chats.length) {
                res.status(200).send(chats);
            } else {
                return this.sendErrorResponse(res, 404, "No Chat Found.");
            }
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
            }
            this.sendErrorResponse(res, 500, "Some error occurred.");
        }
    }

    async getChatById(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            if (!chatId) {
                return this.sendErrorResponse(res, 401, "Permission Denied.");
            }

            const chats = await Chats.findOne({
                include: [
                    {
                        model: Users,
                        required: false,
                        attributes: ["id", "name", "createdAt"],
                        through: {
                            attributes: [],
                        },
                    },
                    {
                        model: Messages,
                        required: false,

                    },
                ],
                where: {
                    isActive: true,
                    id: chatId
                }
            });
            if (chats) {
                res.status(200).send(chats);
            } else {
                return this.sendErrorResponse(res, 404, "No Chat Found.");
            }
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
            }
            this.sendErrorResponse(res, 500, "Some error occurred.");
        }
    }

    async sendMessage(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            const userId = +(req.query.userId as string);
            if (!chatId) {
                return this.sendErrorResponse(res, 401, "Permission Denied.");
            }
            const { message } = req.body;
            const newMessage = await Messages.create({
                message: message,
                userId: userId,
                chatId: chatId
            });

            if (newMessage) {
                res.status(200).send(newMessage);
            } else {
                return this.sendErrorResponse(res, 404, "Message not sent.");
            }
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
            }
            this.sendErrorResponse(res, 500, "Some error occurred.");
        }
    }

    async receiveMessage(req: Request, res: Response) {
        try {
            const chatId = req.params.chatId;
            const page = parseInt(req.query.page as string) || 1;
            if (!chatId) {
                return this.sendErrorResponse(res, 401, "Permission Denied.");
            }

            const messages = await Messages.findAll({
                where: {
                    chatId: chatId,
                },
                limit: 10,
                offset: (page - 1) * 10
            });
            if (messages && messages.length) {
                res.status(200).send(messages);
            } else {
                return this.sendErrorResponse(res, 404, "No Chat Found.");
            }
        } catch (error) {
            console.log(error)
            if (error instanceof z.ZodError) {
                return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
            }
            this.sendErrorResponse(res, 500, "Some error occurred.");
        }
    }
}

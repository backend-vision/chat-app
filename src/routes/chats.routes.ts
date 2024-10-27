import { Router, Request, Response, NextFunction } from "express";
import ChatsController from "../controllers/chats.controller";
import { verify, JwtPayload } from "jsonwebtoken";
import * as dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

class ChatsRoutes {
    router = Router();
    controller = new ChatsController();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("", this.authenticate, this.controller.initiateChat);
        this.router.get("", this.authenticate, this.controller.getChats);
        this.router.get("/:chatId", this.authenticate, this.controller.getChatById);
        this.router.post("/:chatId/messages", this.authenticate, this.controller.sendMessage);
        this.router.get("/:chatId/messages", this.authenticate, this.controller.receiveMessage);
    }

    private handleUnauthorized = (res: Response, message: string = 'Unauthorized Access.') => {
        return res.status(401).json({ message });
    }

    private authenticate = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return this.handleUnauthorized(res);
        }

        try {
            const decoded = verify(token, process.env.JWT_SECRET ?? "Test1@") as JwtPayload;

            if (decoded && 'userId' in decoded) {
                req.query.userId = decoded.userId;
                return next();
            }
        } catch (error) {
            return this.handleUnauthorized(res, "Token Expired");
        }
        return this.handleUnauthorized(res);
    }
}

export default new ChatsRoutes().router;

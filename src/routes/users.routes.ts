import { Router, Request, Response, NextFunction } from "express";
import UsersController from "../controllers/users.controller";
import { verify, JwtPayload } from "jsonwebtoken";
import * as dotenv from 'dotenv';
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

class UsersRoutes {
  router = Router();
  controller = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", this.controller.register);
    this.router.post("/login", this.controller.login);
    this.router.get("/profile", this.authenticate, this.controller.getProfile);
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
      console.error('Token verification failed:', error);
    }

    return this.handleUnauthorized(res);
  }
}

export default new UsersRoutes().router;

import { Request, Response } from "express";
import Users from "../models/users.model";
import { hash, verify } from "argon2";
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(3, { message: "Name Must be 3 or more characters long" }),
  password: z.string().min(4, { message: "Password Must be 4 or more characters long" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(4, { message: "Password Must be 4 or more characters long" }),
});

export default class UsersController {
  constructor() {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  private sendErrorResponse(res: Response, status: number, message: string) {
    return res.status(status).send({ message });
  }

  private removePassword(user: any) {
    if (user) {
      delete user.password;
    }
    return user;
  }

  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { email, name, password } = validatedData;

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return this.sendErrorResponse(res, 400, "User already exists.");
      }

      const hashedPassword = await hash(password);
      const createdUser = await Users.create({
        name,
        email,
        password: hashedPassword,
      });

      const plainUser = this.removePassword(createdUser.get({ plain: true }));
      res.status(201).send(plainUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
      }
      this.sendErrorResponse(res, 500, "Some error occurred.");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const user = await Users.findOne({ where: { email } });
      const plainUser = user?.get({ plain: true });

      if (!plainUser) {
        return this.sendErrorResponse(res, 404, "User Not Found.");
      }

      if (await verify(plainUser.password ?? "", password)) {
        const token = sign(
          { userId: plainUser.id },
          process.env.JWT_SECRET ?? "Test1@",
          { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).send({
          user: this.removePassword(plainUser),
          accessToken: token,
        });
      } else {
        return this.sendErrorResponse(res, 401, "Invalid Credentials.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
      }
      this.sendErrorResponse(res, 500, "Some error occurred.");
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = +(req.query.userId as string);
      if (!userId) {
        return this.sendErrorResponse(res, 401, "Permission Denied.");
      }

      const user = await Users.findOne({ where: { id: userId } });
      if (user) {
        const plainUser = this.removePassword(user.get({ plain: true }));
        res.status(200).send(plainUser);
      } else {
        return this.sendErrorResponse(res, 404, "User Not Found.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return this.sendErrorResponse(res, 400, error.errors.map(e => e.message).join(", "));
      }
      this.sendErrorResponse(res, 500, "Some error occurred.");
    }
  }
}

import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./routes";
import Database from "./db";
import http from "http";
import { Server as SocketServer } from "socket.io";
import socketHandler from "./handlers/sockets.handler";

export default class Server {
  private io: SocketServer;

  constructor(app: Application) {
    const httpServer = http.createServer(app);
    this.io = new SocketServer(httpServer);

    this.config(app);
    this.syncDatabase();
    this.setupSocketIO();
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*"
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    const db = new Database();
    // db.sequelize?.sync({ force: true });
    db.sequelize?.sync();
  }

  private setupSocketIO(): void {
    socketHandler(this.io);
  }
}

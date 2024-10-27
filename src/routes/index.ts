import { Application } from "express";
import users from "./users.routes";
import chats from "./chats.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/users", users);
    app.use("/api/chats", chats);
  }
}

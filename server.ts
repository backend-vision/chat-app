import express, { Application } from "express";
import Server from "./src/index";
import * as dotenv from 'dotenv'
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const app: Application = express();
new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    console.log(err);
  });

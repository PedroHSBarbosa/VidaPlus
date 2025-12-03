import express, {urlencoded} from "express";
import cors from "cors";
import helmet from "helmet";
import { mainRouter } from "./routers/vidaPlusRouters";
import "dotenv/config"

const server = express();

server.use(helmet());
server.use(cors());
server.disable("x-powered-by"),
server.use(urlencoded({ extended: true }));
server.use(express.json());

server.use(mainRouter)


server.listen(process.env.PORT || 3000, () =>
  console.log("Server rodando")
);
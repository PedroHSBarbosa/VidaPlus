import { Router } from "express";
import { createUser, getAllUser } from "../controllers/vidaPlusController";

export const mainRouter = Router();


mainRouter.post("/user", createUser);

mainRouter.get("/users", getAllUser);


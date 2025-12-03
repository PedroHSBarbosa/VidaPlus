import type { Request, Response } from "express";
import *  as vidaPlusService from "../services/vidaPlusService"


/*  -------------------------- Criação -------------------------- */

 export async function createUser(req: Request, res: Response) {
    const data = req.body;


    const user = await vidaPlusService.createUser(data);
    return res.status(201).json(user);
 }



 /*  -------------------------- Listagem -------------------------- */

 export async function getAllUser(req: Request, res: Response) {
    const user = await vidaPlusService.getAllUser()
     return res.status(200).json(user);
 }

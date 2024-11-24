import express, { Request, Response, Router } from "express";
import bcrypt from 'bcrypt';

import User from "../models/user";

const router: Router = express.Router();

router.post('/register', async function (req: Request, res: Response) {
    const data = req.body;
    try {
        if (!data.name || !data.email || !data.password) {
            res.status(400).send("All fields required");
        } else {
            const hashPassword = await bcrypt.hash(data.password, 10);
            const newUser = new User({ name: data.name, email: data.email, password: hashPassword });
            await newUser.save();

            res.status(200).send(newUser);
        }
    } catch (e: any) {
        console.log(e);
        if (e.code == 11000) {
            res.status(409).send("Email already exists");
        } else {
            res.status(500).send("Register failed")
        }
    }
});

export default router;
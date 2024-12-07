import express, { Request, Response, Router } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';

import User from "../models/user";


dotenv.config();

const router: Router = express.Router();
const JWT_SECRET = process.env.SECRET_JWT || '';

router.post('/register', async function (req: Request, res: Response) {
    const data = req.body;
    try {
        if (!data.name || !data.email || !data.password) {
            res.status(400).send("All fields required");
        } else {
            const hashPassword = await bcrypt.hash(data.password, 10);
            const newUser = new User({ name: data.name, email: data.email, password: hashPassword, tasks: [] });
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

router.post('/login', async function (req: Request, res: Response) {
    const data = req.body;
    try {
        if (!data.email || !data.password) {
            res.status(401).send("All fields required");
        } else {
            const user = await User.findOne({ email: data.email });
            if (user != null) {
                bcrypt.compare(data.password, user.password, function (err, result) {
                    if (result) {
                        const token = jwt.sign({ id: user._id, username: user.name }, JWT_SECRET, { expiresIn: 3600 });
                        res.status(200).send({ token: token, user: user });
                    } else {
                        res.status(401).send("The password don't match");
                    }
                });
            } else {
                res.status(401).send("The user w/ this email was not found");
            }
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Something went wrong w/ login")
    }
})

export default router;
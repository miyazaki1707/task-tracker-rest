import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.SECRET_JWT || '';

const checkAuthToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).send("Access denied");
    } else {
        try {
            const verified = jwt.verify(token.split(' ')[1], JWT_SECRET);
            (req as any).user = verified;
            next();
        } catch (e) {
            console.log(e);
            res.status(401).send("Token is invalid");
        }
    }
}

export default checkAuthToken;
import express, { Application, Request, Response, Router } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import taskRouter from './src/routes/tasks';
import usersRouter from './src/routes/users';
import authMiddleware from './src/middlewares/auth';

async function connectToMongo() {
    await mongoose.connect('mongodb://localhost:27017/task-tracker-rest')
}

const app: Application = express();
const port: number = 3000;

app.use(bodyParser.json())

app.use('/todos', authMiddleware, taskRouter); // Router for handling todo CRUD
app.use('/', usersRouter); // Router for handling auth

app.listen(port, () => {
    console.log(`Server has been started on port: ${port}`);
    connectToMongo().catch(err => console.log(err));
})
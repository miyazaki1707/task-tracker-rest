import express, { Application, Request, Response, Router } from "express";
import taskRouter from './src/routes/tasks';
import mongoose from "mongoose";
import bodyParser from "body-parser";

async function connectToMongo() {
    await mongoose.connect('mongodb://localhost:27017/task-tracker-rest')
}

const app: Application = express();
const port: number = 3000;

app.use(bodyParser.json())
app.use('/tasks', taskRouter);

app.listen(port, () => {
    console.log(`Server has been started on port: ${port}`);
    connectToMongo().catch(err => console.log(err));
})
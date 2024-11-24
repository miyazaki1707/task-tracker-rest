import express, { Request, Response, Router } from "express";
import Task from "../models/task";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
    const tasks = await Task.find();

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: tasks }));
})

router.post('/', async function (req: Request, res: Response) {
    const data = req.body;
    try {
        if (!data.title || !data.description) {
            res.status(400).send("Title and description are required.");
        } else {
            const newTask = new Task({ title: data.title, description: data.description });
            await newTask.save();

            res.status(201).send(newTask);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Error was occured");
    }
})

router.put('/:id', async function (req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;

    try {
        const task = await Task.findOneAndUpdate({ _id: id }, data, {
            new: true
        });
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: task }));
    } catch (e) {
        console.log(e);
        res.status(500).send("Error was occured");
    }
});

router.delete('/:id', async function (req: Request, res: Response) {
    const id = req.params.id;

    try {
        await Task.deleteOne({ _id: id });
        res.status(200).send("Succesfull");
    } catch (e) {
        console.log(e);
        res.status(500).send("Error while deleting was occured");
    }
});


export default router;
import mongoose, { Schema } from "mongoose";
import Task from "./task";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}); Task

const User = mongoose.model('User', userSchema);

export default User;
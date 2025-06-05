import express from "express";
import { getAllUsers, getAllUser } from "../controllers/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";


const userRouter = express.Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id", authorize, arcjetMiddleware, getAllUser);

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

export default userRouter;

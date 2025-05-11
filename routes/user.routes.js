import express from "express";
import { getAllUsers, getAllUser } from "../controllers/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";


const userRouter = express.Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id", authorize, arcjetMiddleware, getAllUser);


export default userRouter;

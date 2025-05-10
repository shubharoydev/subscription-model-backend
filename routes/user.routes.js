const express = require("express");
const { getAllUsers, getAllUser } = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.get("/", getAllUsers);

userRouter.get("/:id", getAllUser);


module.exports = userRouter;

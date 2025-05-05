const express = require("express");
const { signUp,signIn,signOut } = require("../controllers/auth.controller");


const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);

authRouter.post("/sign-out", signOut);

module.exports = authRouter;

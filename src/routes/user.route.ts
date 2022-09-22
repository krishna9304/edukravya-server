import Router, { Application } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter: Application = Router();

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);

export default userRouter;

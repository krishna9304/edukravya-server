import Router, { Application } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter: Application = Router();

userRouter.post("/register", UserController.register);

export default userRouter;

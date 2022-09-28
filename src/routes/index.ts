import Router, { Application } from "express";
import chatRouter from "./chat.route";
import userRouter from "./user.route";

const mainRouter: Application = Router();

mainRouter.use("/user", userRouter);
mainRouter.use("/chat", chatRouter);

export default mainRouter;

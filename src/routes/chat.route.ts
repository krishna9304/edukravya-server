import Router, { Application } from "express";
import { ChatController } from "../controllers/chat.controller";
import Authenticate from "../middlewares/jwt";

const chatRouter: Application = Router();

chatRouter.post("/", Authenticate, ChatController.post);
chatRouter.get("/inbox", Authenticate, ChatController.getInbox);
chatRouter.get("/:to", Authenticate, ChatController.getChats);

export default chatRouter;

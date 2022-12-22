import Router, { Application } from "express";
import { ChatController } from "../controllers/chat.controller";
import upload from "../helpers/fileUpload";
import Authenticate from "../middlewares/jwt";

const chatRouter: Application = Router();

chatRouter.post(
  "/",
  upload.single("content"),
  Authenticate,
  ChatController.post
);
chatRouter.get("/inbox", Authenticate, ChatController.getInbox);
chatRouter.get("/:to", Authenticate, ChatController.getChats);
chatRouter.post("/decode", Authenticate, ChatController.decodeFile);

export default chatRouter;

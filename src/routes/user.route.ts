import Router, { Application } from "express";
import { UserController } from "../controllers/user.controller";
import upload from "../helpers/fileUpload";
import Authenticate from "../middlewares/jwt";

const userRouter: Application = Router();

userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);
userRouter.get("/self", UserController.verifyToken);
userRouter.get("/:userId", Authenticate, UserController.getUser);
userRouter.get("/", Authenticate, UserController.getAll);
userRouter.put(
  "/update",
  upload.single("avatar"),
  Authenticate,
  UserController.updateUser
);

export default userRouter;

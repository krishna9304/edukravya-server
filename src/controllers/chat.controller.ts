import { NextFunction, Response } from "express";
import { SERVER_URL, UPLOAD_PATH } from "../constants";
import { ChatFunctions } from "../database/functions/chat.function";
import userModel, { UserInterface } from "../database/models/user.model";
import { compareParams, Info, ResponseTypes } from "../helpers/restHelper";
import { RequestJwt } from "../middlewares/jwt";
import { cryptFunction } from "../services/crypt.service";
import crypto from "crypto";

export const ChatController = {
  async post(
    req: RequestJwt,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const chatData = req.body;
      const paramsReq: Array<string> = ["to", "contentType"];
      const errors: String[] = compareParams(paramsReq, chatData);
      if (errors.length) {
        const returnVal = new Info(
          400,
          "Following parameters are required in the request body: " +
            JSON.stringify(errors),
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }

      const userExists = await userModel.exists({ userId: chatData.to });
      if (userExists) {
        if (req.file) {
          let url =
            req.protocol + "://" + SERVER_URL + "/static/" + req.file.filename;
          if (chatData.embedData) {
            const upload_path = UPLOAD_PATH + "/" + req.file.filename;
            const args = ["-e", upload_path, "-t", chatData.embedData];
            const encodedFileName: string = await cryptFunction(args);
            url =
              req.protocol + "://" + SERVER_URL + "/static/" + encodedFileName;
            chatData.isEncrypted = true;
          }
          chatData.content = url;
        }
        chatData.from = req.user?.userId;
        const chatDoc = await ChatFunctions.insert(chatData);
        return res.status(200).json(chatDoc);
      } else {
        const returnVal = new Info(
          400,
          "UserId not found.",
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
    } catch (error) {
      next(error);
    }
  },

  async getChats(
    req: RequestJwt,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { to } = req.params;
      const { limit, page } = req.query;
      const from = req.user?.userId || "";
      const userExists = await userModel.exists({ userId: to });
      if (userExists) {
        const chats = await ChatFunctions.getChats(
          from,
          to,
          Number(limit),
          Number(page)
        );
        return res.status(200).json(chats);
      } else {
        const returnVal = new Info(
          400,
          "Invalid receiver userId",
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
    } catch (error) {
      next(error);
    }
  },

  async getInbox(
    req: RequestJwt,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const from = req.user?.userId || "";
      const { limit, page } = req.query;
      const directMessages = await ChatFunctions.getDirectMessages(
        from,
        Number(limit),
        Number(page)
      );
      return res.status(200).json(directMessages);
    } catch (error) {
      next(error);
    }
  },

  async decodeFile(
    req: RequestJwt,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const userId = req.user?.userId || "";
      const { filename, passphrase } = req.body;
      const user: UserInterface | null = await userModel.findOne({ userId });
      let hash = crypto
        .pbkdf2Sync(passphrase, String(user?.salt), 1000, 64, `sha512`)
        .toString(`hex`);

      if (user?.password == hash) {
        const upload_path = UPLOAD_PATH + "/" + filename;
        const args = ["-d", upload_path.trim()];
        const decodedData: string = await cryptFunction(args);
        const returnVal = new Info(
          200,
          "Image decoded successfully.",
          ResponseTypes._INFO_,
          { decoded_message: decodedData }
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      } else {
        const returnVal = new Info(
          400,
          "Passphrase didn't match.",
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
    } catch (error) {
      next(error);
    }
  },
};

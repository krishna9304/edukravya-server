import { NextFunction, Request, Response } from "express";
import { compareParams, Info, ResponseTypes } from "../helpers/restHelper";
import { UserServices } from "../services/user.service";
import { UserFunctions } from "../database/functions/user.function";

export const UserController = {
  async register(req: Request, res: Response, next: NextFunction) {
    const reqBody = req.body;
    const paramsReq: Array<string> = ["name", "email", "password", "phone"];
    const errors = compareParams(paramsReq, reqBody);
    if (errors.length) {
      const returnVal = new Info(
        400,
        "Following parameters are required in the request body: " +
          JSON.stringify(errors),
        ResponseTypes._ERROR_
      );
      return res.status(returnVal.getCode()).json(returnVal.getArray());
    }

    try {
      const errors = await UserServices.checkConflicts(reqBody);
      if (errors.length) {
        const returnVal = new Info(
          400,
          "Please check the error stack: " + JSON.stringify(errors),
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
      const user = UserServices.prepareUserData(reqBody);
      const savedDoc = await UserFunctions.insert(user);
      return res.status(201).json(savedDoc);
    } catch (error) {
      next(error);
    }
  },
};

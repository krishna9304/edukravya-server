import { NextFunction, Request, Response } from "express";
import { compareParams, Info, ResponseTypes } from "../helpers/restHelper";
import { UserServices } from "../services/user.service";
import { UserFunctions } from "../database/functions/user.function";
import userModel, { UserInterface } from "../database/models/user.model";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../constants";
import { ObjectId } from "mongoose";

export const UserController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    const reqBody: any = req.body;
    const paramsReq: Array<string> = ["name", "email", "password", "phone"];
    const errors: String[] = compareParams(paramsReq, reqBody);
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
      const errors: String[] = await UserServices.checkConflicts(reqBody);
      if (errors.length) {
        const returnVal = new Info(
          400,
          "Please check the error stack: " + JSON.stringify(errors),
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
      const user: UserInterface = UserServices.prepareUserData(reqBody);
      const savedDoc: any = await UserFunctions.insert(user);
      const token: string = jwt.sign(
        { email: savedDoc.email, phone: savedDoc.phone, _id: savedDoc._id },
        TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      return res.status(201).json({ user: savedDoc, token });
    } catch (error) {
      next(error);
    }
  },

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    const reqBody: any = req.body;
    const paramsReq: Array<string> = ["email", "password"];
    const errors: String[] = compareParams(paramsReq, reqBody);
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
      const userExists: {
        _id: ObjectId;
      } | null = await userModel.exists({ email: reqBody.email });
      if (userExists) {
        const user: UserInterface | null = await userModel.findOne({
          email: reqBody.email,
        });
        if (user?.validPassword(req.body.password)) {
          delete user.password;
          delete user.salt;
          const token: string = jwt.sign(
            { email: user.email, phone: user.phone, _id: user._id },
            TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
          return res.status(200).json({ user, token });
        } else {
          const returnVal = new Info(
            400,
            "Wrong Password",
            ResponseTypes._ERROR_
          );
          return res.status(returnVal.getCode()).json(returnVal.getArray());
        }
      } else {
        const returnVal = new Info(
          400,
          "No user found with the given Email Id",
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
    } catch (error) {
      next(error);
    }
  },

  async verifyToken(req: Request, res: Response, next: NextFunction) {
    const token: string =
      req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
      const returnVal = new Info(403, "No Token Found", ResponseTypes._ERROR_);
      return res.status(returnVal.getCode()).json(returnVal.getArray());
    }
    try {
      const decoded: any = jwt.verify(token, TOKEN_KEY);
      const { _id }: { _id: ObjectId } = decoded;
      const user: any = await UserFunctions.getById(_id);
      return res.status(200).json(user);
    } catch (err) {
      const returnVal = new Info(401, "Invalid Token", ResponseTypes._ERROR_);
      return res.status(returnVal.getCode()).json(returnVal.getArray());
    }
  },
};

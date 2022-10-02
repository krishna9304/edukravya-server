import { NextFunction, Request, Response } from "express";
import { compareParams, Info, ResponseTypes } from "../helpers/restHelper";
import { UserServices } from "../services/user.service";
import { UserFunctions } from "../database/functions/user.function";
import userModel, { UserInterface } from "../database/models/user.model";
import jwt from "jsonwebtoken";
import { SERVER_URL, TOKEN_KEY } from "../constants";
import { ObjectId } from "mongoose";
import { RequestJwt } from "../middlewares/jwt";
import educatorModel from "../database/models/educator.model";

export const UserController = {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    const reqBody: any = req.body;
    const paramsReq: Array<string> = [
      "userId",
      "name",
      "email",
      "password",
      "phone",
    ];
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
      let savedEduDoc;
      if (user.userType === "educator") {
        const educator = new educatorModel();
        savedEduDoc = await educator.save();
        user.educatorId = savedEduDoc._id;
      }
      const savedUserDoc: UserInterface = await UserFunctions.insert(user);
      const token: string = jwt.sign(
        {
          email: savedUserDoc.email,
          phone: savedUserDoc.phone,
          _id: savedUserDoc._id,
        },
        TOKEN_KEY,
        {
          expiresIn: "2d",
        }
      );
      return res.status(201).json({
        user: savedUserDoc,
        educator: savedEduDoc,
        token,
      });
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
    const paramsReq: Array<string> = ["userId", "password"];
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
      } | null = await userModel.exists({ userId: reqBody.userId });
      if (userExists) {
        const user: UserInterface | null = await userModel.findOne({
          userId: reqBody.userId,
        });
        if (user?.validPassword(req.body.password)) {
          delete user.password;
          delete user.salt;
          const token: string = jwt.sign(
            {
              email: user.email,
              phone: user.phone,
              _id: user._id,
              userId: user.userId,
            },
            TOKEN_KEY,
            {
              expiresIn: "2d",
            }
          );
          let educator;
          if (user.educatorId) {
            educator = await educatorModel.findById(user.educatorId);
          }
          return res.status(200).json({
            user,
            educator,
            token,
          });
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

  async verifyToken(req: Request, res: Response, _: NextFunction) {
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
      const newToken: string = jwt.sign(
        {
          email: user.email,
          phone: user.phone,
          _id: user._id,
          userId: user.userId,
        },
        TOKEN_KEY,
        {
          expiresIn: "2d",
        }
      );
      let educator;
      if (user.educatorId) {
        educator = await educatorModel.findById(user.educatorId);
      }
      return res.status(200).json({ user, educator, token: newToken });
    } catch (err) {
      const returnVal = new Info(401, "Invalid Token", ResponseTypes._ERROR_);
      return res.status(returnVal.getCode()).json(returnVal.getArray());
    }
  },

  async updateUser(
    req: RequestJwt,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    const reqBody = req.body;
    const user: UserInterface | undefined = req.user;

    const updateQuery = reqBody;

    if (req.file) {
      const url =
        req.protocol + "://" + SERVER_URL + "/static/" + req.file.filename;
      updateQuery.avatar = url;
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
      if (reqBody.email && user?.email !== reqBody.email) {
        updateQuery.emailVerified = false;
      }
      if (reqBody.phone && user?.phone !== reqBody.phone) {
        updateQuery.phoneVerified = false;
      }
      await UserFunctions.update({ _id: user?._id }, { ...updateQuery });
      const returnVal = new Info(
        200,
        "User details updated successfully.",
        ResponseTypes._INFO_
      );
      return res.status(returnVal.getCode()).json(returnVal.getArray());
    } catch (err) {
      next(err);
    }
  },

  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { userId } = req.params;
      const users = await UserFunctions.get({ userId });
      if (users.length) {
        return res.status(200).json(users[0]);
      } else {
        const returnVal = new Info(
          404,
          "Invalid userId.",
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
    } catch (error) {
      next(error);
    }
  },

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { limit, page } = req.query;
      const users = await UserFunctions.getAll(Number(limit), Number(page));
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
};

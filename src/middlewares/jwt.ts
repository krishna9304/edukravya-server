import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "../constants";
import { UserFunctions } from "../database/functions/user.function";
import { Info, ResponseTypes } from "../helpers/restHelper";

const config = process.env;

const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    const returnVal = new Info(403, "No Token Found", ResponseTypes._ERROR_);
    return res.status(returnVal.getCode()).json(returnVal.getArray());
  }
  try {
    const decoded: any = jwt.verify(token, TOKEN_KEY);
    const { _id } = decoded;
    const user: any = await UserFunctions.getById(_id);
    req.body.user = user;
  } catch (err) {
    const returnVal = new Info(401, "Invalid Token", ResponseTypes._ERROR_);
    return res.status(returnVal.getCode()).json(returnVal.getArray());
  }
  return next();
};

export default Authenticate;

import { NextFunction, Request, Response } from "express";
import { EducatorInterface } from "../database/models/educator.model";
import { UserInterface } from "../database/models/user.model";
import { Info, ResponseTypes } from "../helpers/restHelper";
import { RequestJwt } from "../middlewares/jwt";
import { EducatorService } from "../services/educator.service";

export const EducatorController = {
  async update(
    req: RequestJwt,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const user: UserInterface | undefined = req.user;
      if (user?.educatorId) {
        const { educatorData } = req.body;
        const finalDataToUpdate: EducatorInterface =
          EducatorService.prepareEducatorDataForUpdation(req, educatorData);
      } else {
        const returnVal = new Info(
          404,
          "You are not an educator.",
          ResponseTypes._ERROR_
        );
        return res.status(returnVal.getCode()).json(returnVal.getArray());
      }
    } catch (error) {
      next(error);
    }
  },
};

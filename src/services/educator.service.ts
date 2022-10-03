import { Request } from "express";
import { EducatorInterface } from "../database/models/educator.model";

export const EducatorService = {
  prepareEducatorDataForUpdation(
    req: Request,
    educatorData: EducatorInterface
  ) {
    if (req.files) {
    }
    return educatorData;
  },
};

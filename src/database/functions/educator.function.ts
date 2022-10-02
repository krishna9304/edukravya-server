import { ObjectId } from "mongoose";
import educatorModel from "../models/educator.model";

export const EducatorFunctions = {
  update(_id: ObjectId, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const updated = await educatorModel.findByIdAndUpdate(_id, { ...data });
        resolve(updated);
      } catch (error) {
        reject(error);
      }
    });
  },
};

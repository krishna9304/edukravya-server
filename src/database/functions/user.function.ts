import { ObjectId } from "mongoose";
import userModel, { UserInterface } from "../models/user.model";

export const UserFunctions = {
  insert(userData: UserInterface) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = new userModel(userData);
        user.setPassword(userData.password);
        const userDoc = await user.save();
        resolve(userDoc);
      } catch (error) {
        reject(error);
      }
    });
  },
  update(filter: any, data: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const updated = await userModel.updateMany({ ...filter }, { ...data });
        resolve(updated);
      } catch (error) {
        reject(error);
      }
    });
  },
  getAll() {
    return new Promise(async (resolve, reject) => {
      try {
        const allusers = await userModel.find({});
        resolve(allusers);
      } catch (error) {
        reject(error);
      }
    });
  },
  getById(_id: ObjectId) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await userModel.findById(_id);
        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
  get(filter: any) {
    return new Promise(async (resolve, reject) => {
      try {
        const usersMatched: Array<UserInterface> = await userModel.find({
          ...filter,
        });
        resolve(usersMatched);
      } catch (error) {
        reject(error);
      }
    });
  },
};

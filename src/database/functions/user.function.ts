import { ObjectId } from "mongoose";
import userModel, { UserInterface } from "../models/user.model";

export const UserFunctions = {
  insert(userData: UserInterface): Promise<UserInterface> {
    return new Promise(
      async (
        resolve: (value: UserInterface | PromiseLike<UserInterface>) => void,
        reject: (reason: any) => void
      ): Promise<void> => {
        try {
          const user: UserInterface = new userModel(userData);
          user.setPassword(userData.password);
          const userDoc: UserInterface = await user.save();
          resolve(userDoc);
        } catch (error) {
          reject(error);
        }
      }
    );
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
  getAll(): Promise<UserInterface[]> {
    return new Promise(
      async (
        resolve: (value: UserInterface[]) => void,
        reject: (reason?: any) => void
      ): Promise<void> => {
        try {
          const allusers: UserInterface[] = await userModel.find({});
          resolve(allusers);
        } catch (error) {
          reject(error);
        }
      }
    );
  },
  getById(_id: ObjectId): Promise<UserInterface | null> {
    return new Promise(
      async (
        resolve: (value: UserInterface | null) => void,
        reject: (reason?: any) => void
      ): Promise<void> => {
        try {
          const user: UserInterface | null = await userModel.findById(_id);
          resolve(user);
        } catch (error) {
          reject(error);
        }
      }
    );
  },
  get(filter: any): Promise<UserInterface[]> {
    return new Promise(
      async (
        resolve: (value: UserInterface[]) => void,
        reject: (reason?: any) => void
      ):Promise<void> => {
        try {
          const usersMatched: UserInterface[] = await userModel.find({
            ...filter,
          });
          resolve(usersMatched);
        } catch (error) {
          reject(error);
        }
      }
    );
  },
};

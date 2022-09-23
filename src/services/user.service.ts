import userModel, { UserInterface } from "../database/models/user.model";
import validator from "validator";

export const UserServices = {
  async checkConflicts(user: UserInterface) {
    let errors: Array<String> = [];
    if (user.email && !validator.isEmail(user.email)) {
      errors.push("Unidentified Email.");
    }
    if (user.phone && !validator.isMobilePhone(String(user.phone))) {
      errors.push("Unidentified Phone Number.");
    }
    try {
      const emailExists = await userModel.exists({ email: user.email });
      if (emailExists) errors.push("This email is already in use");
      const phoneExists = await userModel.exists({ phone: user.phone });
      if (phoneExists) errors.push("This phone number is already in use");
    } catch (err: any) {
      errors.push(JSON.stringify(err));
    }
    return errors;
  },

  prepareUserData(user: UserInterface) {
    if (!Object.keys(user).includes("avatar")) {
      const name = user.name;
      const words = name.split(" ");
      const avatarLink = `https://avatar.tobi.sh/tobiaslins.svg?text=${
        words[0][0].toUpperCase() +
        (words.length > 1 ? words[1][0].toUpperCase() : "")
      }`;
      user.avatar = avatarLink;
      console.log(avatarLink);
    }
    return user;
  },
};

import {
  Document,
  Mixed,
  model,
  ObjectId,
  Schema,
  StringSchemaDefinition,
} from "mongoose";
import crypto from "crypto";

export interface UserInterface extends Document {
  validPassword: (password: any) => boolean;
  setPassword: (password: any) => void;
  _id: ObjectId;
  userId: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  password?: string;
  salt?: string;
  userType: "student" | "educator";
  avatar: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  billingAccountId: Mixed | StringSchemaDefinition | undefined;
  educatorId: Mixed | StringSchemaDefinition | undefined;
}

const User = new Schema<UserInterface>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://avatar.tobi.sh/tobiaslins.svg?text=TL",
  },
  userType: {
    type: String,
    default: "student",
    required: true,
    enum: ["student", "educator"],
  },
  bio: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  phoneVerified: {
    type: Boolean,
    default: false,
  },
  billingAccountId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "billingAccount",
  },
  educatorId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "educator",
  },
});

User.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString("hex");

  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
};

User.methods.validPassword = function (password: string) {
  let hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
    .toString(`hex`);
  return this.password === hash;
};

export default model("user", User);

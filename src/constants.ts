export const ISDEV: boolean = process.env.NODE_ENV === "development";
export const PORT: string | number = process.env.PORT || 80;
export const dbUri: string = ISDEV
  ? "mongodb://localhost:27017/edukravya"
  : process.env.MONGO_URI + "";
export const TOKEN_KEY: string = process.env.TOKEN_KEY || "thisismelookatme";

export const ISDEV = process.env.NODE_ENV === "development";
export const PORT = process.env.PORT || 80;
export const dbUri = ISDEV
  ? "mongodb://localhost:27017/edukravya"
  : process.env.MONGO_URI;
export const TOKEN_KEY = process.env.TOKEN_KEY || "thisismelookatme";

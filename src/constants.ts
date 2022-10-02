import path from "path";

export const ISDEV: boolean = process.env.NODE_ENV === "development";
export const PORT: string | number = process.env.PORT || 80;
export const dbUri: string = ISDEV
  ? "mongodb://localhost:27017/edukravya"
  : process.env.MONGO_URI + "";
export const TOKEN_KEY: string = process.env.TOKEN_KEY || "thisismelookatme";
export const SERVER_URL: string = ISDEV
  ? "localhost:" + (process.env.PORT || "80")
  : process.env.SERVER_URL + "";
export const CLIENT_URL: string =
  process.env.CLIENT_URL + "https://edukravya-client.vercel.app";
export const UPLOAD_PATH = path.join(__dirname, "..", "src", "uploads");

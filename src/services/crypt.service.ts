import { ChildProcess, spawn } from "child_process";
import { SCRIPT_PATH } from "../constants";

export const cryptFunction: (args: Array<string>) => Promise<string | any> = (
  args: Array<string>
) => {
  return new Promise(async (resolve, reject) => {
    const python: ChildProcess = spawn("python3", [SCRIPT_PATH, ...args]);

    await python.stdout?.on("data", (data: string) => {
      resolve(data.toString());
    });

    await python.stderr?.on("data", (data: string) => {
      reject(data.toString());
    });

    await python.on("close", (code: number) => {
      console.log(`child process close all stdio with code ${code}`);
      resolve(null);
    });
  });
};

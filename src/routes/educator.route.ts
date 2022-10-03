import Router, { Application } from "express";
import { EducatorController } from "../controllers/educator.controller";
import upload from "../helpers/fileUpload";
import Authenticate from "../middlewares/jwt";

const EducatorRouter: Application = Router();

EducatorRouter.put(
  "/",
  upload.fields([
    { name: "educationalQualificationsFiles", maxCount: 3 },
    { name: "publicationsFiles", maxCount: 3 },
    { name: "certificationsFiles", maxCount: 3 },
    { name: "professionalExperiencesFiles", maxCount: 3 },
  ]),
  Authenticate,
  EducatorController.update
);

export default EducatorRouter;

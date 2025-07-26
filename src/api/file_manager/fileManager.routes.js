import express from "express";
import multer from "multer";

import { appConfig } from "../../core/config/config.js";
import { asyncWrapper } from "../../core/utils/asyncWrapper.js";
import fileManagerController from "./fileManager.controller.js";

const fileRouter = express.Router();
const upload = multer({ dest: appConfig.folder });

fileRouter.post(
  "/",
  upload.single("file"),
  asyncWrapper(fileManagerController.uploadFile)
);
fileRouter.get("/", asyncWrapper(fileManagerController.getAllFiles));
fileRouter.get("/:publicKey", asyncWrapper(fileManagerController.downloadFile));
fileRouter.delete(
  "/:privateKey",
  asyncWrapper(fileManagerController.deleteFile)
);

export default fileRouter;

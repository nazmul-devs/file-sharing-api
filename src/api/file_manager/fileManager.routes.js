import express from "express";
import multer from "multer";

import { appConfig } from "../../core/config/config.js";
import {
  downloadLimiter,
  uploadLimiter,
} from "../../core/middlewares/rateLimiter.js";
import { asyncWrapper } from "../../core/utils/asyncWrapper.js";
import fileManagerController from "./fileManager.controller.js";

const fileRouter = express.Router();
const upload = multer({ dest: appConfig.folder });

// create
fileRouter.post(
  "/",
  uploadLimiter,
  upload.single("file"),
  asyncWrapper(fileManagerController.uploadFile)
);

// get all
fileRouter.get("/", asyncWrapper(fileManagerController.getAllFiles));

// download
fileRouter.get(
  "/:publicKey",
  downloadLimiter,
  asyncWrapper(fileManagerController.downloadFile)
);

// delete
fileRouter.delete(
  "/:privateKey",
  asyncWrapper(fileManagerController.deleteFile)
);

export default fileRouter;

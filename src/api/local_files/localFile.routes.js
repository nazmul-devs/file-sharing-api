import express from "express";
import multer from "multer";


import { appConfig } from "../../core/config/config.js";
import GoogleFileManager from "../../services/googleFileManager.js";
import LocalFileManager from "./localFile.service.js";
const localFileRouter = express.Router();


const upload = multer({ dest: appConfig.folder });

let fileManager;
if (appConfig.provider === "google") {
  fileManager = new GoogleFileManager(appConfig.config);
} else {
  fileManager = new LocalFileManager();
}

localFileRouter.post("/", upload.single("file"), async (req, res) => {
  // console.error("File upload error:", req.file);

  const { filename, originalname } = req.file;
  const result = await fileManager.uploadFile(filename, originalname);
  res.json(result);
});

localFileRouter.get("/:publicKey", async (req, res) => {
  const file = await fileManager.downloadFile(req.params.publicKey);
  if (!file) return res.status(404).json({ error: "File not found" });

  res.setHeader("Content-Type", file.mimeType);
  file.stream.pipe(res);
});

localFileRouter.delete("/:privateKey", async (req, res) => {
  const result = await fileManager.deleteFile(req.params.privateKey);
  if (!result) return res.status(404).json({ error: "File not found" });

  res.json({ message: "File deleted successfully" });
});

export default localFileRouter;

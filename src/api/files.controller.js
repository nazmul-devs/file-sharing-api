import express from "express";
import multer from "multer";
import LocalFileManager from "../services/localFileManager.js";
const fileRouter = express.Router();
const fileManager = new LocalFileManager();

const upload = multer({ dest: process.env.FOLDER });

fileRouter.post("/", upload.single("file"), async (req, res) => {
  const { filename, originalname } = req.file;
  const result = await fileManager.uploadFile(filename, originalname);
  res.json(result);
});

fileRouter.get("/:publicKey", async (req, res) => {
  const file = await fileManager.downloadFile(req.params.publicKey);
  if (!file) return res.status(404).json({ error: "File not found" });

  res.setHeader("Content-Type", file.mimeType);
  file.stream.pipe(res);
});

fileRouter.delete("/:privateKey", async (req, res) => {
  const result = await fileManager.deleteFile(req.params.privateKey);
  if (!result) return res.status(404).json({ error: "File not found" });

  res.json({ message: "File deleted successfully" });
});

export default fileRouter;

import express from "express";
import multer from "multer";
import GoogleFileManager from "../services/googleFileManager.js";
import LocalFileManager from "../services/localFileManager.js";
const fileRouter = express.Router();
const provider = process.env.PROVIDER || "local";

const upload = multer({ dest: process.env.FOLDER });

let fileManager;
if (provider === "google") {
  fileManager = new GoogleFileManager(process.env.CONFIG);
} else {
  fileManager = new LocalFileManager();
}

fileRouter.post("/", upload.single("file"), async (req, res) => {
  console.error("File upload error:", req.file);

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

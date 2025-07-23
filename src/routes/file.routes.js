import express from "express";
import { upload } from "../middlewares/multer.js";
import { bucket } from "../lib/gcs.js";

const cloudRoute = express.Router();

// 📤 Upload file
cloudRoute.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) =>
      res.status(500).send({ error: err.message })
    );

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ message: "Uploaded!", url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 📄 View (get signed URL)
cloudRoute.get("/view/:filename", async (req, res) => {
  try {
    const file = bucket.file(req.params.filename);
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });
    res.redirect(url);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 🗑 Delete file
cloudRoute.delete("/delete/:filename", async (req, res) => {
  try {
    await bucket.file(req.params.filename).delete();
    res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default cloudRoute;

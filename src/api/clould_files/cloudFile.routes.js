import express from "express";



import { BadRequestError, HttpError, ServerError } from "../../core/utils/errors.js";
import { bucket } from "../../lib/gcs.js";
import { upload } from "../../middlewares/multer.js";

const cloudFileRoute = express.Router();

// 📤 Upload file
cloudFileRoute.post("/upload", upload.single("file"), async (req, res) => {
    try {

        // input validation
        if (!req.file) {
            throw new BadRequestError("No file uploaded");
        }

        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();

        // Catch stream errors and forward to middleware
        blobStream.on("error", (err) => {

            const mainError = err.response.data || {};
            const error = JSON.parse(mainError).error;


            // Throw your custom error (if needed)
            throw new HttpError(error.code, error.message, error.errors);
        });

        blobStream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            res.status(200).send({ message: "Uploaded!", url: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        throw new HttpError(error?.statusCode, error?.message, error?.details);

    }
});

// 📄 View (get signed URL)
cloudFileRoute.get("/view/:filename", async (req, res) => {
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
cloudFileRoute.delete("/delete/:filename", async (req, res) => {
    try {
        await bucket.file(req.params.filename).delete();
        res.status(200).send({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default cloudFileRoute;

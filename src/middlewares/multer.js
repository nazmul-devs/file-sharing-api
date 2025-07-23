import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".png" && ext !== ".jpg" && ext !== ".pdf") {
    return cb(new Error("Only images and PDFs are allowed"), false);
  }
  cb(null, true);
};

export const upload = multer({ storage, fileFilter });

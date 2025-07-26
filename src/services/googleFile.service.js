import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

import FileManagerInterface from "../api/file_manager/fileManager.interface.js";
import { appConfig } from "../core/config/config.js";
import { HttpError } from "../core/utils/errors.js";
import { generateKeys } from "../core/utils/keyGenerator.js";

class GoogleFileService extends FileManagerInterface {
  constructor(configPath) {
    super();

    // Resolve config path (from env or passed param)
    if (!configPath) {
      throw new Error(
        "❌ GoogleFileService: CONFIG env variable or constructor path is required."
      );
    }

    const config = JSON.parse(fs.readFileSync(configPath));
    this.bucketName = config.bucket;
    this.keyMapPath = path.resolve(config.keyMapPath || "./keymap.json");
    this.keyMap = fs.existsSync(this.keyMapPath)
      ? JSON.parse(fs.readFileSync(this.keyMapPath))
      : {};

    this.storage = new Storage({ keyFilename: config.serviceAccountPath });
    this.bucket = this.storage.bucket(this.bucketName);
  }

  saveKeyMap() {
    fs.writeFileSync(this.keyMapPath, JSON.stringify(this.keyMap, null, 2));
  }

  async uploadFile(tempFilename, originalName) {
    try {
      const { publicKey, privateKey } = generateKeys();
      const destination = `${publicKey}-${originalName}`;
      const tempPath = path.join(appConfig.folder, tempFilename);

      // Upload to GCS
      await this.bucket.upload(tempPath, {
        destination,
        contentType: "auto",
      });

      // Save key map
      this.keyMap[publicKey] = {
        privateKey,
        originalName,
        gcsPath: destination,
        createdAt: Date.now(),
      };
      this.saveKeyMap();

      // Remove local file after upload
      fs.unlinkSync(tempPath);

      return { publicKey, privateKey };
    } catch (err) {
      const error = JSON.parse(err.message)?.error;
      throw new HttpError(error?.code, error?.message, error?.errors);
    }
  }

  // 📜 Get all files in the bucket
  getAllFiles = async () => {
    try {
      const [files] = await bucket.getFiles(); // Fetch all files
      const fileList = files.map((file) => ({
        name: file.name,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        updated: file.metadata.updated,
        publicUrl: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
      }));

      res.status(200).send({ success: true, files: fileList });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  };

  async downloadFile(publicKey) {
    const entry = this.keyMap[publicKey];
    if (!entry) return null;

    const file = this.bucket.file(entry.gcsPath);
    const exists = await file.exists();
    if (!exists[0]) return null;

    return {
      stream: file.createReadStream(),
      mimeType:
        entry.originalName.split(".").pop() || "application/octet-stream",
    };
  }

  async deleteFile(privateKey) {
    const entry = Object.entries(this.keyMap).find(
      ([, value]) => value.privateKey === privateKey
    );
    if (!entry) return false;

    const [publicKey, value] = entry;

    await this.bucket
      .file(value.gcsPath)
      .delete()
      .catch(() => {});
    delete this.keyMap[publicKey];
    this.saveKeyMap();
    return true;
  }

  async cleanupInactiveFiles(expiryTime) {
    const now = Date.now();
    for (const [publicKey, value] of Object.entries(this.keyMap)) {
      if (now - value.createdAt > expiryTime) {
        await this.bucket
          .file(value.gcsPath)
          .delete()
          .catch(() => {});
        delete this.keyMap[publicKey];
      }
    }
    this.saveKeyMap();
  }
}

export default GoogleFileService;

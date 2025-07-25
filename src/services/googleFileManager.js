import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

import { appConfig } from "../core/config/config.js";
import { generateKeys } from "../core/utils/keyGenerator.js";
import FileManagerInterface from "./fileManager.interface.js";

class GoogleFileManager extends FileManagerInterface {
  constructor(configPath) {
    super();

       // Resolve config path (from env or passed param)
    if (!configPath) {
      throw new Error("❌ GoogleFileManager: CONFIG env variable or constructor path is required.");
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
    const { publicKey, privateKey } = generateKeys();
    const destination = `${publicKey}-${originalName}`;
    const tempPath = path.join(appConfig.folder, tempFilename);

    await this.bucket.upload(tempPath, {
      destination,
      contentType: "auto",
    });

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
  }

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
      .catch(() => { });
    delete this.keyMap[publicKey];
    this.saveKeyMap();
    return true;
  }

  async cleanupInactiveFiles(expiryTime = 24 * 3600 * 1000) {
    const now = Date.now();
    for (const [publicKey, value] of Object.entries(this.keyMap)) {
      if (now - value.createdAt > expiryTime) {
        await this.bucket
          .file(value.gcsPath)
          .delete()
          .catch(() => { });
        delete this.keyMap[publicKey];
      }
    }
    this.saveKeyMap();
  }
}

export default GoogleFileManager;

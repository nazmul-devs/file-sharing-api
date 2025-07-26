import fs from "fs";
import mime from "mime-types";
import path from "path";

import FileManagerInterface from "../api/file_manager/fileManager.interface.js";
import { appConfig } from "../core/config/config.js";
import { generateKeys, getKeyMapPath } from "../core/utils/keyGenerator.js";

class LocalFileService extends FileManagerInterface {
  constructor() {
    super();
    this.folder = appConfig.folder || "/absolute/path/to/uploads";
    this.keyMapPath = getKeyMapPath();
    this.keyMap = this.loadKeyMap();
  }

  loadKeyMap() {
    if (fs.existsSync(this.keyMapPath)) {
      return JSON.parse(fs.readFileSync(this.keyMapPath));
    }
    return {};
  }

  saveKeyMap() {
    fs.writeFileSync(this.keyMapPath, JSON.stringify(this.keyMap, null, 2));
  }

  /** upload file */
  async uploadFile(filename, originalName) {
    const { publicKey, privateKey } = generateKeys();
    this.keyMap[publicKey] = {
      privateKey,
      filename,
      originalName,
      createdAt: Date.now(),
    };
    this.saveKeyMap();
    return { publicKey, privateKey };
  }

  /** Get all files metadata */
  async getAllFiles() {
    return Object.entries(this.keyMap).map(([publicKey, value]) => {
      const filePath = path.join(this.folder, value.filename);
      return {
        publicKey,
        privateKey: value.privateKey,
        originalName: value.originalName,
        createdAt: value.createdAt,
        exists: fs.existsSync(filePath),
        mimeType: mime.lookup(value.originalName) || "application/octet-stream",
        size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      };
    });
  }

  /** download file */
  async downloadFile(publicKey) {
    const entry = this.keyMap[publicKey];
    if (!entry) return null;

    const filePath = path.join(this.folder, entry.filename);
    if (!fs.existsSync(filePath)) return null;

    return {
      stream: fs.createReadStream(filePath),
      mimeType: mime.lookup(entry.originalName) || "application/octet-stream",
    };
  }

  /** delete file */
  async deleteFile(privateKey) {
    const entry = Object.entries(this.keyMap).find(
      ([, value]) => value.privateKey === privateKey
    );
    if (!entry) return false;

    const [publicKey, value] = entry;
    const filePath = path.join(this.folder, value.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    delete this.keyMap[publicKey];
    this.saveKeyMap();
    return true;
  }

  /** cleanup inactive files */
  async cleanupInactiveFiles(expiryTime = 24 * 3600 * 1000) {
    const now = Date.now();
    for (const [publicKey, value] of Object.entries(this.keyMap)) {
      if (now - value.createdAt > expiryTime) {
        const filePath = path.join(this.folder, value.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        delete this.keyMap[publicKey];
      }
    }
    this.saveKeyMap();
  }
}

export default LocalFileService;

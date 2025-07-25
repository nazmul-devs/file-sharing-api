import fs from "fs";
import mime from "mime-types";
import path from "path";

import { appConfig } from "../../core/config/config.js";
import { generateKeys, getKeyMapPath } from "../../core/utils/keyGenerator.js";
import FileManagerInterface from "../../services/fileManager.interface.js";



class LocalFileManager extends FileManagerInterface {
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

    async downloadFile(publicKey) {
        const entry = this.keyMap[publicKey];
        if (!entry) return null;

        if (!this.folder) throw new Error("❌ LocalFileManager: folder is undefined");
        if (!value?.filename) throw new Error("❌ filename is missing in value");


        const filePath = path.join(this.folder, entry.filename);
        if (!fs.existsSync(filePath)) return null;

        return {
            stream: fs.createReadStream(filePath),
            mimeType: mime.lookup(entry.originalName) || "application/octet-stream",
        };
    }

    async deleteFile(privateKey) {
        const entry = Object.entries(this.keyMap).find(
            ([, value]) => value.privateKey === privateKey
        );
        if (!entry) return false;

        if (!this.folder) throw new Error("❌ LocalFileManager: folder is undefined");
        if (!value?.filename) throw new Error("❌ filename is missing in value");

        const [publicKey, value] = entry;
        const filePath = path.join(this.folder, value.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        delete this.keyMap[publicKey];
        this.saveKeyMap();
        return true;
    }

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

export default LocalFileManager;

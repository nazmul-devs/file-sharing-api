import { appConfig } from "../../core/config/config.js";
import GoogleFileService from "../../services/googleFile.service.js";
import LocalFileService from "../../services/localFile.service.js";

let fileManager;

if (appConfig.provider === "google") {
  fileManager = new GoogleFileService(appConfig.config);
} else {
  fileManager = new LocalFileService();
}

class FileService {
  async uploadFile(filename, originalname) {
    return await fileManager.uploadFile(filename, originalname);
  }

  async getAllFiles() {
    return await fileManager.getAllFiles();
  }

  async downloadFile(publicKey) {
    return await fileManager.downloadFile(publicKey);
  }

  async deleteFile(privateKey) {
    return await fileManager.deleteFile(privateKey);
  }
}

export default new FileService();

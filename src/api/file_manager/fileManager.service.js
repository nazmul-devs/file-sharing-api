import { BaseService } from "../../core/base/base.service.js";

class FileService extends BaseService {
  /**
   * upload file
   * @param {*} filename
   * @param {*} originalname
   * @returns
   */
  async uploadFile(filename, originalname) {
    return await this.fileManager.uploadFile(filename, originalname);
  }

  /**
   * get all files
   * @returns
   */
  async getAllFiles() {
    return await this.fileManager.getAllFiles();
  }

  /**
   * download file
   * @param {*} publicKey
   * @returns
   */
  async downloadFile(publicKey) {
    return await this.fileManager.downloadFile(publicKey);
  }

  /**
   * delete file
   * @param {*} privateKey
   * @returns
   */
  async deleteFile(privateKey) {
    return await this.fileManager.deleteFile(privateKey);
  }

  /**
   * cleanup inactive files
   * @param {*} expiryTime
   * @returns
   */
  async cleanupInactiveFiles(expiryTime = 24 * 3600 * 1000) {
    return await this.fileManager.cleanupInactiveFiles(expiryTime);
  }
}

export default new FileService();

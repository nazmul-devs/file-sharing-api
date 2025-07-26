class FileManagerInterface {
  async uploadFile(filePath, originalName) {
    throw new Error("uploadFile not implemented");
  }

  async getAllFiles() {
    throw new Error("Get all files not implemented");
  }

  async downloadFile(publicKey) {
    throw new Error("downloadFile not implemented");
  }

  async deleteFile(privateKey) {
    throw new Error("deleteFile not implemented");
  }
}
export default FileManagerInterface;

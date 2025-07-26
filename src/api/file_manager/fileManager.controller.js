import fileManagerService from "./fileManager.service.js";

class FileController {
  /**
   * Upload file
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async uploadFile(req, res) {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    try {
      const { filename, originalname } = req.file;
      const result = await fileManagerService.uploadFile(
        filename,
        originalname
      );

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "File upload failed",
        details: err.details || null,
      });
    }
  }

  /**
   * get all files
   * @param {*} req
   * @param {*} res
   */
  async getAllFiles(req, res) {
    const data = await fileManagerService.getAllFiles();
    res.json({ success: true, data });
  }

  /**
   * download file
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async downloadFile(req, res) {
    const file = await fileManagerService.downloadFile(req.params.publicKey);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.setHeader("Content-Type", file.mimeType);
    file.stream.pipe(res);
  }

  /**
   * delete file
   * @param {*} req
   * @param {*} res
   * @returns
   */
  async deleteFile(req, res) {
    const result = await fileManagerService.deleteFile(req.params.privateKey);
    if (!result) return res.status(404).json({ error: "File not found" });

    res.json({ success: true, message: "File deleted successfully" });
  }
}

export default new FileController();

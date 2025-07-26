import fileManagerService from "../api/file_manager/fileManager.service.js";
import { appConfig } from "../core/config/config.js";

export function cleanupJob() {
  setInterval(() => {
    fileManagerService.cleanupInactiveFiles(appConfig.fileExpiryTimeMs);
    console.log("🧹 Cleaned up old files");
  }, appConfig.cleanupIntervalMs);
}

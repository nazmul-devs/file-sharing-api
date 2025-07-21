import LocalFileManager from "../services/localFileManager.js";

const fileManager = new LocalFileManager();

export function cleanupJob() {
  setInterval(() => {
    fileManager.cleanupInactiveFiles();
    console.log("🧹 Cleaned up old files");
  }, 3600 * 1000); // every 1 hour
}

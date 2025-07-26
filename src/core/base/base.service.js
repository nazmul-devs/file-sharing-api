import GoogleFileService from "../../services/googleFile.service.js";
import LocalFileService from "../../services/localFile.service.js";
import { appConfig } from "../config/config.js";

export class BaseService {
  constructor() {
    if (appConfig.provider === "google") {
      this.fileManager = new GoogleFileService(appConfig.config);
    } else {
      this.fileManager = new LocalFileService();
    }
  }
}

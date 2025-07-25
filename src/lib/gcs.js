import { Storage } from "@google-cloud/storage";
import { appConfig } from "../core/config/config.js";



const storage = new Storage({
  projectId: appConfig.googleCloudProjectId,
  keyFilename: appConfig.googleApplicationCredentials,
});

const bucket = storage.bucket(appConfig.googleCloudBucketName);

export { bucket, storage };


// src/core/config/app.ts
import dotenv from "dotenv";
import path from "path";

// Load env variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const appConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
  folder: process.env.FOLDER,
  provider: process.env.PROVIDER || "local",
  config: process.env.CONFIG,

  cleanupIntervalMs: process.env.CLEANUP_INTERVAL_MS || 3600000,
  fileExpiryTimeMs: process.env.FILE_EXPIRY_TIME_MS || 24 * 3600 * 1000,

  googleCloudProjectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  googleCloudBucketName: process.env.GOOGLE_CLOUD_BUCKET_NAME || "fileSharing",

  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },

  db: {
    url: process.env.DATABASE_URL || "",
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  serviceKeys: {
    authApiKey: process.env.AUTH_API_KEY,
    paymentApiKey: process.env.PAYMENT_API_KEY,
  },

  appName: process.env.APP_NAME || "Naria API",
};

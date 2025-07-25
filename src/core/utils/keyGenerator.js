import { randomUUID } from "crypto";
import path from "path";
import { appConfig } from "../config/config.js";

export function generateKeys() {
  return {
    publicKey: randomUUID(),
    privateKey: randomUUID(),
  };
}

export function getKeyMapPath() {
  return path.join(appConfig.folder, "_keymap.json");
}

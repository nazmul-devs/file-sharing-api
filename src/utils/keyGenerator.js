import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { randomUUID } from "crypto";

export function generateKeys() {
  return {
    publicKey: randomUUID(),
    privateKey: randomUUID(),
  };
}

export function getKeyMapPath() {
  return path.join(process.env.FOLDER, "_keymap.json");
}

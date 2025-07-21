import { randomUUID } from "crypto";
import path from "path";

export function generateKeys() {
  return {
    publicKey: randomUUID(),
    privateKey: randomUUID(),
  };
}

export function getKeyMapPath() {
  return path.join(process.env.FOLDER, "_keymap.json");
}

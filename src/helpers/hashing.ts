import crypto from "crypto";

export const generateSalt = () => crypto.randomBytes(128).toString("base64");
export const authentication = (password: string, salt: string) =>
  process.env.SECRET
    ? crypto.pbkdf2Sync(password, salt, 1000, 64, "sha256").toString("hex")
    : null;

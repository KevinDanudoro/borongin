import crypto from "crypto";

export const random = () => crypto.randomBytes(128).toString("base64");
export const authentication = (salt: string, password: string) =>
  process.env.SECRET
    ? crypto
        .createHmac("sha256", process.env.SECRET)
        .update([salt, password].join("/"))
        .digest("hex")
    : null;

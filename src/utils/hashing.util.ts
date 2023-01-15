import bcrypt from "bcrypt";
import crypto from "crypto";

export const compare = async (v1: string, enc: string) => {
  return await bcrypt.compare(v1, enc);
};

const algorithm = "aes-256-ctr";
const secretKey = process.env.SECRETKEY as string;

export const encrypt = (text: any): any => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

export const decrypt = (hash: any): any => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

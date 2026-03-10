import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV || "development";

const envPath = {
  development: ".env.development",
  production: ".env.production",
};

config({
  path: resolve(`./config/${envPath[NODE_ENV]}`),
});

export const port = process.env.PORT ?? 7000;

export const DB_URI = process.env.DB_URI;

export const SALT_ROUND = Number(process.env.SALT_ROUND) || 10;
export const IV_LENGTH = Number(process.env.IV_LENGTH) || 16;
export const ENC_SECRET_KEY = process.env.ENC_SECRET_KEY;

export const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "your-secret-access-key";
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-secret-refresh-key";
export const JWT_OTP_SECRET =
  process.env.JWT_OTP_SECRET || "your-secret-otp-key";

export const JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE || "1h";
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "gmail";
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

export const OTP_TTL = Number(process.env.OTP_TTL) || 5 * 60 * 1000;

export const MAX_OTP_ATTEMPTS = Number(process.env.MAX_OTP_ATTEMPTS) || 5;

export const MAX_FILE_SIZE =
  Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export const RSA_KEY_SIZE = Number(process.env.RSA_KEY_SIZE) || 2048;

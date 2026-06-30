import multer from "multer";
import path from "path";
import { Request } from "express";
import { HttpException } from "../exceptions/http-exception";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    // Always resolve from project root (process.cwd()), not __dirname (src/)
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    // Sanitize original filename to remove spaces/special chars
    const safeOriginalName = file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
    const ext = path.extname(safeOriginalName) || `.${file.mimetype.split("/")[1]}`;
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new HttpException(400, "Only JPEG, PNG and WebP images are allowed"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter,
});

export const uploads = {
  single: (fieldName: string) => upload.single(fieldName),
  array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
  fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray),
};

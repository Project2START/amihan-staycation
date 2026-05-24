import multer from "multer";

interface UploadOptions {
  allowedTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
}

const DEFAULT_OPTIONS: Required<UploadOptions> = {
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
};

export function createUpload(options: UploadOptions = {}) {
  const { allowedTypes, maxFileSize, maxFiles } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return multer({
    storage: multer.memoryStorage(),
    fileFilter(_req, file, cb) {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"));
      }
      cb(null, true);
    },
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
  });
}

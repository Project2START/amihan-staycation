import { Router } from "express";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { productController } from "./controllers/product.controller";
import multer from "multer";

const router = Router();

// POST

// const upload = multer({
//   storage: multer.memoryStorage(), // keeps files in memory
//   fileFilter(req, file, cb) {
//     if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
//       return cb(new Error("Invalid file type")); // rejects invalid mimetypes
//     }
//     cb(null, true); // accepts valid files
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB per file
//     files: PHOTOS_MAX, // max files
//   },
// });

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create",
  upload.array("photo_files"),
  asyncHandler(productController.createProduct),
);

export default router;

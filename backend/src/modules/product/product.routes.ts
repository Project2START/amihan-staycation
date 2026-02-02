import { Router } from "express";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { productController } from "./controllers/product.controller";
import multer from "multer";
import { validateSchema } from "../../middleware/validateSchema";
import {
  productSchema,
  productWithPhotosSchema,
} from "./schemas/product.schema";
import { PHOTOS_MAX } from "../../shared/constants/productFormValidation";
import { requireAuth } from "../../middleware/requireAuth";
import { checkRole } from "../../middleware/checkRole";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(), // keeps files in memory
  fileFilter(req, file, cb) {
    if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
      return cb(new Error("Invalid file type")); // rejects invalid mimetypes
    }
    cb(null, true); // accepts valid files
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: PHOTOS_MAX, // max files
  },
});

router.post(
  "/",
  requireAuth,
  checkRole(["admin"]),
  upload.array("photo_files"),
  validateSchema(productSchema),
  asyncHandler(productController.createProduct),
);

router.get("/", asyncHandler(productController.getProducts));
router.get("/:id", asyncHandler(productController.getProduct));

router.put(
  "/",
  requireAuth,
  checkRole(["admin"]),
  upload.array("photo_files"),
  validateSchema(productWithPhotosSchema),
  asyncHandler(productController.updateProduct),
);

router.delete(
  "/:id",
  requireAuth,
  checkRole(["admin"]),
  asyncHandler(productController.deleteProduct),
);

export default router;

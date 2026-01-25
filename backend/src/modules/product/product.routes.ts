import { Router } from "express";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { productController } from "./controllers/product.controller";
import multer from "multer";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });
// POST

router.post(
  "/create",
  upload.array("photo_files"),
  asyncHandler(productController.createProduct),
);

export default router;

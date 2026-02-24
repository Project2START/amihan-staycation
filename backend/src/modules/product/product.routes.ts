import { Router } from "express";
import { asyncHandler } from "../../shared/helpers/asyncHandler";
import { productController } from "./controllers/product.controller";
import { validateSchema } from "../../middleware/validateSchema";
import {
  productSchema,
  productWithPhotosSchema,
} from "./schemas/product.schema";
import { PHOTOS_MAX } from "../../shared/constants/productFormValidation";
import { checkAuth } from "../../middleware/checkAuth";
import { checkRole } from "../../middleware/checkRole";
import { createUpload } from "../../middleware/upload";

const router = Router();

const upload = createUpload({ maxFiles: PHOTOS_MAX });

router.post(
  "/",
  checkAuth,
  checkRole(["admin"]),
  upload.array("photo_files"),
  validateSchema(productSchema),
  asyncHandler(productController.createProduct),
);

router.get("/", asyncHandler(productController.getProducts));

router.get(
  "/admin",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(productController.getProductsById),
);

router.get("/:id", asyncHandler(productController.getProduct));

router.put(
  "/",
  checkAuth,
  checkRole(["admin"]),
  upload.array("photo_files"),
  validateSchema(productWithPhotosSchema),
  asyncHandler(productController.updateProduct),
);

router.delete(
  "/:id",
  checkAuth,
  checkRole(["admin"]),
  asyncHandler(productController.deleteProduct),
);

export default router;

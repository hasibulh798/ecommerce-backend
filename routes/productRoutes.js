import express from "express";
import {
  createProductController,
  deleteProductController,
  deleteProductImgController,
  getAllProductController,
  getTopThreeProductController,
  productReviewController,
  singleProductController,
  updateProductController,
  updateProductImgController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Get All Product
router.get("/get-all", getAllProductController);
// Get top 3 Product
router.get("/top-three", getTopThreeProductController);

// single product
router.get("/:id", singleProductController);

// create product
router.post("/create", isAuth, isAdmin, singleUpload, createProductController);

// update product
router.put("/:id", isAuth, isAdmin, updateProductController);

// update product image
router.put(
  "/image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImgController
);

// delete product image
router.delete("/image-delete/:id", isAuth, isAdmin, deleteProductImgController);

// delete product image
router.delete("/delete/:id", isAuth, isAdmin, deleteProductController);

// product reviews
router.put("/:id/review", isAuth, productReviewController);

export default router;

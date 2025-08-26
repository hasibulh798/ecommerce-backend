import express from "express";
import {
  createProductController,
  deleteProductController,
  deleteProductImgController,
  getAllProductController,
  singleProductController,
  updateProductController,
  updateProductImgController,
} from "../controllers/productController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Get All Product
router.get("/get-all", getAllProductController);

// single product
router.get("/:id", singleProductController);

// create product
router.post("/create", isAuth, singleUpload, createProductController);

// update product
router.put("/:id", isAuth, updateProductController);

// update product image
router.put("/image/:id", isAuth, singleUpload, updateProductImgController);

// delete product image
router.delete("/image-delete/:id", isAuth, deleteProductImgController);

// delete product image
router.delete("/delete/:id", isAuth, deleteProductController);

export default router;

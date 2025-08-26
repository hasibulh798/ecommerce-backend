import express from "express";

import { isAuth } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// Get All category
router.get("/get-all", getAllCategoryController);

// create product
router.post("/create", isAuth, createCategoryController);

// update product
router.put("/update/:id", isAuth, updateCategoryController);

// delete category
router.delete("/delete/:id", isAuth, deleteCategoryController);

export default router;

import express from "express";

import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
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
router.post("/create", isAuth, isAdmin, createCategoryController);

// update product
router.put("/update/:id", isAuth, isAdmin, updateCategoryController);

// delete category
router.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

export default router;

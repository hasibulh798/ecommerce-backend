import express from "express";

import { isAuth } from "../middlewares/authMiddleware.js";
import {
  createOrderController,
  getAllOrderController,
  getSingleOrderController,
} from "../controllers/orderController.js";

const router = express.Router();

// create
router.post("/create", createOrderController);

// get all orders
router.get("/my-orders", isAuth, getAllOrderController);

// get single orders
router.get("/my-orders/:id", isAuth, getSingleOrderController);

export default router;

import express from "express";

import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOrderController,
  getAllOrdersController,
  getSingleOrderController,
} from "../controllers/orderController.js";

const router = express.Router();

// create
router.post("/create", isAuth, isAdmin, createOrderController);

// get all orders
router.get("/my-orders", isAuth, getAllOrderController);

// get single orders
router.get("/my-orders/:id", isAuth, getSingleOrderController);

/// ===== Admin part ====///

// get all users
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

// change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;

import express from "express";

import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllOrderController,
  getAllOrdersController,
  getSingleOrderController,
} from "../controllers/orderController.js";
import {
  paymentIntegrationController,
  paymentSuccessController,
  sslcommerzIpnController,
} from "../controllers/paymentIntegrationController.js";

const router = express.Router();

// create
router.post("/create", isAuth, isAdmin, createOrderController);

// get all orders
router.get("/my-orders", isAuth, getAllOrderController);

// get single orders
router.get("/my-orders/:id", isAuth, getSingleOrderController);

// payment checkout
router.get("/init-payment/:orderId", paymentIntegrationController);

////sslcommerz validation

router.post("/payment/ipn", isAuth, sslcommerzIpnController);

//Payment success failed and cancel route
router.post("/payment/success/:orderId", paymentSuccessController);
router.post("/payment/fail", (req, res) => {
  res.status(200).send("<h2>This is payment failed page</h2>");
});
router.post("/payment/cancel", (req, res) => {
  res.status(200).send("<h2>This is payment cancel page</h2>");
});

/// ===== Admin part ====///

// get all users
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);

// change order status
router.put("/admin/order/:id", isAuth, isAdmin, changeOrderStatusController);

export default router;

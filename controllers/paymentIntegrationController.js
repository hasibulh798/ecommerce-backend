import mongoose from "mongoose";
import SSLCommerzPayment from "sslcommerz-lts";
import orderModel from "../models/orderModel.js";

//ssl commerz config
const store_id = process.env.SSL_STORE_ID;
const store_pass = process.env.SSL_STORE_PASS;
const is_live = false; // true for live, false for sandbox

// Controller
export const paymentIntegrationController = async (req, res) => {
  //ssl commerz config
  const store_id = process.env.SSL_STORE_ID;
  const store_pass = process.env.SSL_STORE_PASS;
  const is_live = false; // true for live, false for sandbox

  const { name, email, phone, totalAmount } = req.body;
  const { orderId } = req.params;

  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: orderId + Date.now(), // unique transaction id
    success_url: `http://localhost:8080/api/v1/order/payment/success/${orderId}`,
    fail_url: `http://localhost:8080/api/v1/order/payment/fail/${orderId}`,
    cancel_url: "http://localhost:8080/api/v1/order/payment/cancel",
    ipn_url: "http://localhost:8080/api/v1/order/payment/ipn",
    shipping_method: "Courier",
    product_name: "Computer",
    product_category: "Electronic",
    product_profile: "general",

    // customer info
    cus_name: name,
    cus_email: email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
    cus_fax: "01711111111",

    // shipping info
    ship_name: name,
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  try {
    const order = await orderModel.findById(orderId);
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    const sslcz = new SSLCommerzPayment(store_id, store_pass, is_live);
    const apiResponse = await sslcz.init(data);
    // console.log("SSLCommerz Response:", apiResponse);

    if (apiResponse?.GatewayPageURL) {
      return res.status(200).json({
        success: true,
        url: apiResponse.GatewayPageURL,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment session init failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment integration error",
      error: error.message,
    });
  }
};

// payment success controller
export const paymentSuccessController = async (req, res) => {
  //ssl commerz config
  const store_id = process.env.SSL_STORE_ID;
  const store_pass = process.env.SSL_STORE_PASS;
  const is_live = false; // true for live, false for sandbox
  try {
    const { val_id } = req.body;
    const { orderId } = req.params;

    console.log(orderId);

    if (!val_id)
      return res
        .status(404)
        .send({ success: false, message: "val id not found" });
    const sslcz = new SSLCommerzPayment(store_id, store_pass, is_live);
    const validate = await sslcz.validate({ val_id });
    if (
      !validate ||
      !validate.status ||
      !["VALID", "VALIDATED"].includes(validate.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment validation failed",
        validate,
      });
    }
    console.log("SSLCommerz Validate Response:", validate);

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).send({
        message: false,
        message: "order id is not valid",
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      (order._id.toString() === orderId && validate) ||
      validate.status ||
      ["VALID", "VALIDATED"].includes(validate.status)
    ) {
      order.paymentStatus = "paid";
      await order.save();
      res.status(200).send({
        success: true,
        message: " Payment complete",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in success api",
      error: error.message,
    });
  }
};

// IPN Controller
export const sslcommerzIpnController = async (req, res) => {
  try {
    console.log("📩 IPN Full Body:", req.body);
    // SSLCommerz এখানে POST করে
    const { val_id, tran_id } = req.body;

    if (!val_id) {
      return res.status(400).json({
        success: false,
        message: "val_id missing from IPN",
      });
    }

    // validate API call
    const sslcz = new SSLCommerzPayment(store_id, store_pass, is_live);
    const response = await sslcz.validate({ val_id });

    console.log("Validation Response:", response);

    if (response && response.status === "VALID") {
      // Order confirm/update করুন
      await orderModel.findOneAndUpdate(
        { transactionId: tran_id },
        {
          paymentStatus: "Paid",
          bank_tran_id: response.bank_tran_id,
          card_type: response.card_type,
          val_id: response.val_id,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: response,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment validation failed",
        data: response,
      });
    }
  } catch (error) {
    console.error("IPN Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in IPN controller",
      error,
    });
  }
};

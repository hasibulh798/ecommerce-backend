import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      paymentMethod,
      orderItems,

      totalAmount,
      shippingCharges,
      itemPrice,
      tax,
      paymentStatus,
      user,
    } = req.body;
    //validation

    // create order
    const order = await orderModel.create({
      user: req.body._id,
      shippingInfo,
      paymentMethod,
      orderItems,

      totalAmount,
      shippingCharges,
      itemPrice,
      tax,
      paymentStatus,
    });

    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in create order API",
      error,
    });
  }
};

//getAllOrderController

export const getAllOrderController = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.user._id });
    if (!orders) {
      res.status(404).send({
        success: false,
        message: "Orders not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "My orders fetched",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in get all order API",
      error,
    });
  }
};

// getSingleOrderController

export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: "My order fetched",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in get all order API",
      error,
    });
  }
};

// Admin get all orders controller

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    if (!orders) {
      res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "All orders Fetched",
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in get All orders API",
      error,
    });
  }
};

// change order status- Admin

export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "order not found",
      });
    }
    if (order.orderStatus === "Processing") order.orderStatus = "Shipped";
    else if (order.orderStatus === "Shipped") {
      order.orderStatus = "Delivered";
      order.deliveredAt = Date.now();
    } else {
      return res.status(500).send({
        success: false,
        message: "Product already delivered",
      });
    }
    await order.save();
    res.status(200).send({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in change order status API",
      error,
    });
  }
};

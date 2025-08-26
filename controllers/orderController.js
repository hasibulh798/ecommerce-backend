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
      paymentInfo,
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
      paymentInfo,
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

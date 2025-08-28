import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        require: [true, "Address is required"],
      },
      city: {
        type: String,
        require: [true, "City is required"],
      },
      country: {
        type: String,
        require: [true, "Country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          require: [true, "Product name is required"],
        },
        price: {
          type: Number,
          require: [true, "Product price is required"],
        },
        quantity: {
          type: Number,
          require: [true, "Product quantity is required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          require: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: [true, "User is required"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      require: [true, "Product price is required"],
    },
    tax: {
      type: Number,
      require: [true, "Product tax is required"],
    },
    shippingCharges: {
      type: Number,
      require: [true, "Product Shipping charge is required"],
    },
    totalAmount: {
      type: Number,
      require: [true, "Product total amount is required"],
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;

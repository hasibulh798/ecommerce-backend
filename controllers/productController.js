import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";
import userModel from "../models/userModel.js";
// all product controller
export const getAllProductController = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).send({
      success: true,
      message: "All product get successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in all product API",
      error,
    });
  }
};

// get single product controller
export const singleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found!",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product Fetching successfully.",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in single product API",
      error,
    });
  }
};

// create product controller
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: " Please provie product image",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const img = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      productImg: [img],
    });
    res.status(200).send({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in create product API",
      error,
    });
  }
};

// update product controller
export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid product ID",
      });
    }
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product update successfully",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in update product API",
      error,
    });
  }
};

//update Product Img Controller
export const updateProductImgController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "File not given",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // Step 4: productImg ফিল্ড চেক করে তাতে পুশ করা
    if (!Array.isArray(product.productImg)) {
      product.productImg = []; // যদি না থাকে তাহলে array বানিয়ে নিও
    }

    // product.productImg.shift();
    product.productImg.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product image updated successfully",
    });
  } catch (error) {
    console.error("Product update error:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).send({
      success: false,
      message: "Error in update product API",
      error: error.message,
    });
  }
};

// delete product image controller
export const deleteProductImgController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    //vlaidation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    // image id
    const imgId = req.query.id;
    console.log(imgId);

    if (!imgId) {
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    const imgIndex = product.productImg.findIndex(
      (item) => item._id.toString() === imgId.toString()
    );
    if (imgIndex < 0) {
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });
    }
    // delete img from cloudinary
    await cloudinary.v2.uploader.destroy(
      product.productImg[imgIndex].public_id
    );
    product.productImg.splice(imgIndex, 1);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in delete product image API",
      error: error.message,
    });
  }
};

// delete product controller

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: ID valid কিনা চেক করা
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invlid Product id",
      });
    }

    // Step 2: প্রোডাক্ট খোঁজা
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Step 3: প্রোডাক্টের সাথে থাকা ইমেজ Cloudinary থেকে মুছে ফেলা
    if (Array.isArray(product.productImg)) {
      for (let img of product.productImg) {
        if (img.public_id) {
          await cloudinary.v2.uploader.destroy(img.public_id);
        }
      }
    }

    // Step 4: প্রোডাক্ট ডেটাবেজ থেকে ডিলিট করা
    await productModel.findByIdAndDelete(id);

    // Step 5: সফল রেসপন্স পাঠানো
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Delete API",
      error: error.message,
    });
  }
};

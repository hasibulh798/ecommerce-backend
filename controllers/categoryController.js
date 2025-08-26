import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";

export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "Fetch All Category",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in All category API",
      error,
    });
  }
};

export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      res.status(400).send({
        success: false,
        message: "Please Give category name",
      });
    }
    await categoryModel.create({ category });
    res.status(200).send({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in create category API",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Id is invalid",
      });
    }

    const { updatedCategory } = req.body;
    if (!updatedCategory) {
      return res.status(404).send({
        success: false,
        message: "Please provide updated category name",
      });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { category: updatedCategory },
      { new: true }
    );
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Category is Updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in delete category API",
      error,
    });
  }
};

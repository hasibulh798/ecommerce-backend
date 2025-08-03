import { compare } from "bcrypt";
import userModel from "../models/userModel.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } = req.body;

    // validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      res.status(400).send({
        success: false,
        massege: "All field are required!",
      });
    }
    // exishting error
    const exishtingUser = await userModel.findOne({ email });
    // validation
    if (exishtingUser) {
      return res.status(500).send({
        success: false,
        massege: "Email has already taken",
      });
    }
    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
    });
    res.status(201).send({
      success: true,
      massege: "Registration successfull. Please login",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      massege: "Error in API",
      error,
    });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Add email or passord",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "User not found!",
      });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Login successfully..",
        token,
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in API",
      error,
    });
  }
};

// profile controller
export const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Profile fetch successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in profile API",
      error,
    });
  }
};

// Logout Controller
export const logoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", " ", {
        expires: new Date(Date.now()),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "Logout successfully..",
      });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in logout API",
      error,
    });
  }
};

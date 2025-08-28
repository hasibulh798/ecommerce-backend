import { compare } from "bcrypt";
import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;

    // validation
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
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
      answer,
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

// profile update controller
export const profileUpdateController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    // save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "profile update successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in profile update API",
      error,
    });
  }
};

// update password controller
export const updatePassController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    //validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }
    const isMatch = await user.comparePassword(oldPassword);
    //validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old password",
      });
    }
    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "password update successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in password update API",
      error,
    });
  }
};

// update user profile pic
export const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // file get from client
    const file = getDataUri(req.file);
    // delete prev image
    if (user.profilePic?.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    } //update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save func
    await user.save();

    res.status(200).send({
      success: true,
      message: "profile picture updated successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in profile pic update API",
      error: error.message,
    });
  }
};

// reset password controller
export const resetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    // find user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      res.status(404).send({
        success: false,
        message: "Invalid user or answer",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password has been reset.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in reset password API",
      error,
    });
  }
};

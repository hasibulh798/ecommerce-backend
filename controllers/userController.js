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
        massege: "Add email or passord",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).send({
        success: false,
        massege: "User not found!",
      });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(500).send({
        success: false,
        massege: "Invalid password",
      });
    }
    res.status(200).send({
      success: true,
      massege: "Login successfully..",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      massege: "Error in API",
    });
  }
};

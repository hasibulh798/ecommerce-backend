import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    // Token verify
    const decodeData = JWT.verify(token, process.env.JWT_SECRET);

    // User finding
    const user = await userModel.findById(decodeData._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// admin part

export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "Admin only",
    });
  }
  next();
};

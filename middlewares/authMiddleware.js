import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // Token না থাকলে
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: Token missing",
      });
    }

    // Token verify করা
    const decodeData = JWT.verify(token, process.env.JWT_SECRET);

    // User খোঁজা
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

import express from "express";

import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUpdateController,
  registerController,
  resetPasswordController,
  updatePassController,
  updateProfilePicController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { rateLimit } from "express-rate-limit";

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});

//router object
const router = express.Router();

//route
router.post("/register", limiter, registerController);

//login
router.post("/login", limiter, loginController);

// profile
router.get("/profile", isAuth, getUserProfileController);

//logout
router.get("/logout", isAuth, logoutController);

// profile update
router.put("/profile-update", isAuth, profileUpdateController);

// update password
router.put("/password-update", isAuth, updatePassController);

// update profile pic
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// reset password
router.put("/reset-password", isAuth, resetPasswordController);

// export
export default router;

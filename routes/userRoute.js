import express from "express";

import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//route
router.post("/register", registerController);

//login
router.post("/login", loginController);

// profile
router.get("/profile", isAuth, getUserProfileController);

//logout
router.get("/logout", isAuth, logoutController);

// export
export default router;

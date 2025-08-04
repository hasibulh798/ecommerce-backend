import express from "express";

import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUpdateController,
  registerController,
  updatePassController,
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

// profile update
router.put("/profile-update", isAuth, profileUpdateController);

// update password
router.put("/password-update", isAuth, updatePassController);

// export
export default router;

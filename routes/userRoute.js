import express from "express";

import {
  getUserProfileController,
  loginController,
  logoutController,
  profileUpdateController,
  registerController,
  updatePassController,
  updateProfilePicController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

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

// update profile pic
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// export
export default router;

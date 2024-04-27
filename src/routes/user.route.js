import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { veifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(veifyJWT, logoutUser);
router.route("/changePassword").post(veifyJWT, changeCurrentPassword);
router.route("/user").get(veifyJWT, getCurrentUser);
router.route("/user").post(veifyJWT, updateAccountDetails);
router
  .route("/userAvatar")
  .post(upload.single("avatar"), veifyJWT, updateUserAvatar);
router
  .route("/userCoverImage")
  .post(upload.single("coverImage"), veifyJWT, updateUserCoverImage);
router.route("/refreshToken").post(refreshAccessToken);

export default router;

import express from "express";
import { registerUserController, verifyEmailController, loginController, logoutController, uploadAvatar, updateUserDetails, forgotPasswordController, verifyForgotPassword, resetPassword, refreshToken, userDetails } from "../controllers/userController.js";
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js";

const router=express.Router();
router.post("/register",registerUserController)
router.post("/verify-email",verifyEmailController)
router.post("/login",loginController)
router.get("/logout",auth,logoutController)
router.put("/upload-avatar",auth,upload.single('avatar'),uploadAvatar)
router.put("/update-user",auth,updateUserDetails)
router.put("/forgot-password",forgotPasswordController)
router.put("/verify-forgot-password-otp",verifyForgotPassword)
router.put("/reset-password",resetPassword)
router.post("/refresh-token",refreshToken)
router.get("/user-details",auth,userDetails)

export default router

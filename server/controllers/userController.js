import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { verifyEmailTemplate } from "../utils/verifyEmailTemp.js";
import dotenv from "dotenv";
import { generatedAccessToken } from "../utils/generateAccessToken.js";
import { generatedRefreshToken } from "../utils/generateRefreshToken.js";
import uploadImageCLoudinary from "../utils/uploadImageCloudinary.js";
import { generatedOtp } from "../utils/generatedOtp.js";
import { forgotPasswordTemplate } from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";

dotenv.config();

export async function registerUserController(request, response) {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "Provide email, name and password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (user) {
      return response.json({
        message: "User already exist",
        error: true,
        success: false,
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const payload = {
      name,
      email,
      password: hashPassword,
    };
    const newUser = new UserModel(payload);
    const savedUser = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email/${savedUser._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from CityShop",
      html: verifyEmailTemplate({
        name,
        verificationLink: verifyEmailUrl,
      }),
    });

    return response.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function verifyEmailController(request, response) {
  try {
    const { code } = request.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return response.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }
    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return response.json({
      message: "Verify email success",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function loginController(request, response) {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).json({
        message: "Provide email, password",
        success: false,
        error: true,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "User not registered",
        success: false,
        error: true,
      });
    }
    if (user.status !== "Active") {
      return response.status(400).json({
        message: "Contact to Admin",
        success: false,
        error: true,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accessToken", accessToken, cookiesOption);
    response.cookie("refreshToken", refreshToken, cookiesOption);
    return response.json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function logoutController(request, response) {
  try {
    const userId = request.userId; //Taken from auth middleware
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.clearCookie("accessToken", cookiesOption);
    response.clearCookie("refreshToken", cookiesOption);

    const refreshToken = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });

    return response.json({
      message: "Logout successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function uploadAvatar(request, response) {
  try {
    const userId = request.userId; //auth middleware
    const image = request.file; //multer middleware
    const upload = await uploadImageCLoudinary(image);
    console.log("image", image);
    console.log("Cloudinary Upload Result:", upload);
    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.secure_url,
    });
    return response.json({
      message: "Upload profile",
      success:true,
      error:false,
      data: {
        _id: userId,
        avatar: upload.secure_url,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function updateUserDetails(request, response) {
  try {
    const userId = request.userId; //auth middleware
    const { name, email, mobile, password } = request.body;
    let hashPassword = "";
    if (password) {
      hashPassword = await bcrypt.hash(password, 10);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );

    return response.json({
      message: "Updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

// Forgot password when not login
export async function forgotPasswordController(request, response) {
  try {
    const { email } = request.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        success: false,
        error: true,
      });
    }
    const otp = await generatedOtp();
    const expireTime = Date.now() + 60 * 60 * 1000; //1hr

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    const sendOtp = await sendEmail({
      sendTo: email,
      subject: "Forgot password from CitySHop",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });
    return response.json({
      message: "Check your email",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// verify forgot password otp
export async function verifyForgotPassword(request, response) {
  try {
    const { email, otp } = request.body;
    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide required field email, otp",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "Email not available",
        success: false,
        error: true,
      });
    }
    const currentTime = new Date().toISOString();
    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "OTP is expired",
        success: false,
        error: true,
      });
    }
    if (otp !== user.forgot_password_otp) {
      return response.status.json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }
    // if otp is not expired and otp === user.forgot_password_otp
    const updateUser=await UserModel.findByIdAndUpdate(user?._id,{
      forgot_password_otp:"",
      forgot_password_expiry:"",
    })
    return response.json({
      message: "otp is verified",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

// Reset password
export async function resetPassword(request, response) {
  try {
    const { email, newPassword, confirmPassword } = request.body;
    if (!email || !newPassword || !confirmPassword) {
      return response.status(400).json({
        message: "Provide required fields email, newPassword, confirmPassword",
        success: false,
        error: true,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return response.status(400).json({
        message: "Email is not available",
        success: false,
        error: true,
      });
    }
    if (newPassword !== confirmPassword) {
      return response.status(400).json({
        message: "New password and confirm password donen't match",
        success: false,
        error: true,
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });
    return response.json({
      message: "Password reset successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

// Refresh token controller
export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies.refreshToken ||
      request?.headers?.authorization?.split(" ")[1]; // ["Bearer","" Token]
    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid token",
        success: false,
        error: true,
      });
    }
    const verifToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    if (!verifToken) {
      return response.status(401).json({
        message: "Token expired",
        success: false,
        error: true,
      });
    }
    // console.log("verify token",verifToken);
    const userId = verifToken._id;
    const newAccessToken = await generatedAccessToken(userId);
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    response.cookie("accessToken", newAccessToken, cookiesOption);
    return response.json({
      message: "New access token generated",
      success: true,
      error: false,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

export async function userDetails(request, response) {
  try {
    const userId = request.userId;
    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );
    return response.json({
      message: "User details",
      success: true,
      error: false,
      data: user,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
}

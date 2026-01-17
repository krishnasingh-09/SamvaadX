import {
  sendWelcomeEmail,
  sendOTPEmail,
  sendEmailVerificationEmail,
  sendPasswordResetOTPEmail,
} from "../emails/emailHandlers.js"
import { generateToken, generateOTP, generateEmailVerificationToken } from "../lib/utils.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import { ENV } from "../lib/env.js"
import cloudinary from "../lib/cloudinary.js"

/**
 * SIGNUP
 */
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const otp = generateOTP()
    const otpExpiryMs = 10 * 60 * 1000 // 10 minutes

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      isEmailVerified: false,
      otp,
      otpExpiry: new Date(Date.now() + otpExpiryMs),
    })

    const emailSent = await sendOTPEmail(user.email, user.fullName, otp, otpExpiryMs)

    if (!emailSent) {
      console.warn(`⚠️ OTP email failed for ${email}`)
    }

    if (ENV.NODE_ENV === "development") {
      console.log(`🔐 OTP for ${email}: ${otp}`)
    }

    return res.status(201).json({
      message: emailSent
        ? "OTP sent to your email. Please verify to complete signup."
        : "Account setup started, but OTP email could not be sent. Please resend OTP.",
      email: user.email,
      requiresOTP: true,
    })
  } catch (error) {
    console.error("Error in signup controller:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * VERIFY OTP
 */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.isEmailVerified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    generateToken(user._id, res)

    sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL)

    return res.status(200).json({
      message: "Email verified successfully! You are now logged in.",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.error("Error in verifyOTP controller:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * RESEND OTP
 */
export const resendOTP = async (req, res) => {
  const { email } = req.body

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    const otp = generateOTP()
    const otpExpiryMs = 10 * 60 * 1000

    user.otp = otp
    user.otpExpiry = new Date(Date.now() + otpExpiryMs)
    await user.save()

    const emailSent = await sendOTPEmail(user.email, user.fullName, otp, otpExpiryMs)

    if (ENV.NODE_ENV === "development") {
      console.log(`🔐 OTP for ${email}: ${otp}`)
    }

    return res.status(200).json({
      message: emailSent ? "OTP resent successfully" : "Could not send OTP. Please try again later.",
    })
  } catch (error) {
    console.error("Error in resendOTP:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * VERIFY EMAIL (kept for backward compatibility)
 */
export const verifyEmail = async (req, res) => {
  const { token, email } = req.body

  try {
    if (!token || !email) {
      return res.status(400).json({ message: "Token and email are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "User not found" })

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    if (user.emailVerificationToken !== token || new Date() > user.emailVerificationTokenExpiry) {
      return res.status(400).json({ message: "Invalid or expired verification token" })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationTokenExpiry = null
    await user.save()

    generateToken(user._id, res)

    sendWelcomeEmail(user.email, user.fullName, ENV.CLIENT_URL)

    return res.status(200).json({
      message: "Email verified successfully!",
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.error("Error in verifyEmail controller:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * RESEND VERIFICATION EMAIL (kept for backward compatibility)
 */
export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body

  try {
    if (!email) return res.status(400).json({ message: "Email is required" })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "User not found" })

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" })
    }

    const emailVerificationToken = generateEmailVerificationToken()
    const tokenExpiryMs = 24 * 60 * 60 * 1000

    user.emailVerificationToken = emailVerificationToken
    user.emailVerificationTokenExpiry = new Date(Date.now() + tokenExpiryMs)
    await user.save()

    const emailSent = await sendEmailVerificationEmail(
      user.email,
      user.fullName,
      `${ENV.CLIENT_URL}/verify-email?token=${emailVerificationToken}&email=${encodeURIComponent(email)}`,
      tokenExpiryMs,
    )

    if (!emailSent) {
      console.warn(`⚠️ Verification email failed for ${email}`)
    }

    return res.status(200).json({
      message: emailSent ? "Verification email sent successfully" : "Could not send email. Please try again later.",
    })
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * LOGIN
 */
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }

  try {
    const user = await User.findOne({ email })
    if (!user || !user.isEmailVerified) {
      return res.status(401).json({ message: "Invalid credentials or email not verified" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    generateToken(user._id, res)

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.error("Error in login controller:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * LOGOUT
 */
export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 })
  return res.status(200).json({ message: "Logged out successfully" })
}

/**
 * UPDATE PROFILE
 */
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" })
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic)

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    )

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error("Error in updateProfile:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * FORGOT PASSWORD - Send OTP
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ message: "If an account exists with this email, you will receive an OTP." })
    }

    const otp = generateOTP()
    const otpExpiryMs = 10 * 60 * 1000 // 10 minutes

    user.otp = otp
    user.otpExpiry = new Date(Date.now() + otpExpiryMs)
    await user.save()

    const emailSent = await sendPasswordResetOTPEmail(user.email, user.fullName, otp, otpExpiryMs)

    if (ENV.NODE_ENV === "development") {
      console.log(`🔐 Password Reset OTP for ${email}: ${otp}`)
    }

    return res.status(200).json({
      message: emailSent ? "OTP sent to your email for password reset." : "Could not send OTP. Please try again later.",
    })
  } catch (error) {
    console.error("Error in forgotPassword:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

/**
 * RESET PASSWORD - Verify OTP and set new password
 */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" })
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.otp = null
    user.otpExpiry = null
    await user.save()

    return res.status(200).json({ message: "Password reset successfully. You can now login with your new password." })
  } catch (error) {
    console.error("Error in resetPassword:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}









// import { sendWelcomeEmail } from "../emails/emailHandlers.js";
// import { generateToken } from "../lib/utils.js";
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import { ENV } from "../lib/env.js";
// import cloudinary from "../lib/cloudinary.js";

// export const signup = async (req, res) => {
//   const { fullName, email, password } = req.body;

//   try {
//     if (!fullName || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "Password must be at least 6 characters" });
//     }

//     // check if emailis valid: regex
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     const user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "Email already exists" });

//     // 123456 => $dnjasdkasj_?dmsakmk
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//     });

//     if (newUser) {
//       // before CR:
//       // generateToken(newUser._id, res);
//       // await newUser.save();

//       // after CR:
//       // Persist user first, then issue auth cookie
//       const savedUser = await newUser.save();
//       generateToken(savedUser._id, res);

//       res.status(201).json({
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         profilePic: newUser.profilePic,
//       });

//       try {
//         await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
//       } catch (error) {
//         console.error("Failed to send welcome email:", error);
//       }
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     console.log("Error in signup controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });
//     // never tell the client which one is incorrect: password or email

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

//     generateToken(user._id, res);

//     res.status(200).json({
//       _id: user._id,
//       fullName: user.fullName,
//       email: user.email,
//       profilePic: user.profilePic,
//     });
//   } catch (error) {
//     console.error("Error in login controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const logout = (_, res) => {
//   res.cookie("jwt", "", { maxAge: 0 });
//   res.status(200).json({ message: "Logged out successfully" });
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic } = req.body;
//     if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

//     const userId = req.user._id;

//     const uploadResponse = await cloudinary.uploader.upload(profilePic);

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { profilePic: uploadResponse.secure_url },
//       { new: true }
//     );

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.log("Error in update profile:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

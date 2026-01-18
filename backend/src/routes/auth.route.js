import express from "express"
import {
  signup,
  login,
  logout,
  updateProfile,
  verifyOTP,
  resendOTP,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"

const router = express.Router()

//router.use(arcjetProtection)

router.post("/signup", signup)
router.post("/verify-otp", verifyOTP)
router.post("/resend-otp", resendOTP)

router.post("/login", login)
router.post("/logout", logout)

router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

// Kept for backward compatibility
router.post("/verify-email", verifyEmail)
router.post("/resend-verification-email", resendVerificationEmail)

router.put("/update-profile", protectRoute, updateProfile)

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user))

export default router






// import express from "express";
// import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import { arcjetProtection } from "../middleware/arcjet.middleware.js";

// const router = express.Router();

// router.use(arcjetProtection);

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);

// router.put("/update-profile", protectRoute, updateProfile);

// router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

// export default router;

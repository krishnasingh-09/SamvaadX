import jwt from "jsonwebtoken"
import { ENV } from "./env.js"
import crypto from "crypto"

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured")
  }

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  })

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: "strict", // CSRF attacks
    secure: ENV.NODE_ENV === "development" ? false : true,
  })

  return token
}

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex")
}











// import jwt from "jsonwebtoken";
// import { ENV } from "./env.js";

// export const generateToken = (userId, res) => {
//   const { JWT_SECRET } = ENV;
//   if (!JWT_SECRET) {
//     throw new Error("JWT_SECRET is not configured");
//   }

//   const token = jwt.sign({ userId }, JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, // MS
//     httpOnly: true, // prevent XSS attacks: cross-site scripting
//     sameSite: "strict", // CSRF attacks
//     secure: ENV.NODE_ENV === "development" ? false : true,
//   });

//   return token;
// };

// // http://localhost
// // https://dsmakmk.com

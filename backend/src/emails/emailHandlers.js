import transporter from "../lib/nodemailer.js"
import {
  createWelcomeEmailTemplate,
  createOTPEmailTemplate,
  createEmailVerificationTemplate,
  createPasswordResetOTPTemplate,
} from "../emails/emailTemplates.js"

/**
 * Send welcome email
 * Returns true if sent, false if failed
 */
export const sendWelcomeEmail = async (email, name, clientURL) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "SamvaadX"} <${process.env.EMAIL_FROM || "no-reply@samvaadx.com"}>`,
      to: email,
      subject: "Welcome to SamvaadX!",
      html: createWelcomeEmailTemplate(name, clientURL),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Welcome email sent:", info?.messageId || info)
    return true
  } catch (error) {
    console.error("Welcome email failed:", error.message)
    return false
  }
}

export const sendOTPEmail = async (email, name, otp, otpExpiry) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "SamvaadX"} <${process.env.EMAIL_FROM || "no-reply@samvaadx.com"}>`,
      to: email,
      subject: "Your OTP for SamvaadX Email Verification",
      html: createOTPEmailTemplate(name, otp, otpExpiry),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("OTP email sent:", info?.messageId || info)
    return true
  } catch (error) {
    console.error("OTP email failed:", error.message)
    return false
  }
}

export const sendEmailVerificationEmail = async (email, name, verificationLink, tokenExpiry) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "SamvaadX"} <${process.env.EMAIL_FROM || "no-reply@samvaadx.com"}>`,
      to: email,
      subject: "Verify Your Email - SamvaadX",
      html: createEmailVerificationTemplate(name, verificationLink, tokenExpiry),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Verification email sent:", info?.messageId || info)
    return true
  } catch (error) {
    console.error("Verification email failed:", error.message)
    return false
  }
}

export const sendPasswordResetOTPEmail = async (email, name, otp, otpExpiry) => {
  try {
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || "SamvaadX"} <${process.env.EMAIL_FROM || "no-reply@samvaadx.com"}>`,
      to: email,
      subject: "Password Reset OTP - SamvaadX",
      html: createPasswordResetOTPTemplate(name, otp, otpExpiry),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Password reset OTP email sent:", info?.messageId || info)
    return true
  } catch (error) {
    console.error("Password reset OTP email failed:", error.message)
    return false
  }
}









// import { resendClient, sender } from "../lib/resend.js";
// import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";

// export const sendWelcomeEmail = async (email, name, clientURL) => {
//   const { data, error } = await resendClient.emails.send({
//     from: `${sender.name} <${sender.email}>`,
//     to: email,
//     subject: "Welcome to SamvaadX!",
//     html: createWelcomeEmailTemplate(name, clientURL),
//   });

//   if (error) {
//     console.error("Error sending welcome email:", error);
//     throw new Error("Failed to send welcome email");
//   }

//   console.log("Welcome Email sent successfully", data);
// };

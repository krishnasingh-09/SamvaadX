export function createWelcomeEmailTemplate(name, clientURL) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to SamvaadX</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="SamvaadX Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to SamvaadX!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We're excited to have you join our messaging platform! SamvaadX connects you with friends, family, and colleagues in real-time, no matter where they are.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Get started in just a few steps:</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Set up your profile picture</li>
          <li style="margin-bottom: 10px;">Find and add your contacts</li>
          <li style="margin-bottom: 10px;">Start a conversation</li>
          <li style="margin-bottom: 0;">Share photos, videos, and more</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href=${clientURL} style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Open SamvaadX</a>
      </div>
      
      <p style="margin-bottom: 5px;">If you need any help or have questions, we're always here to assist you.</p>
      <p style="margin-top: 0;">Happy messaging!</p>
      
      <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The SamvaadX Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 SamvaadX. All rights reserved.</p>
      <p>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>
  </body>
  </html>
  `
}

export function createOTPEmailTemplate(name, otp, otpExpiry) {
  const expiryMinutes = Math.round(otpExpiry / (1000 * 60))

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP - SamvaadX</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Email Verification</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>Thank you for signing up for SamvaadX! To verify your email address and complete your registration, please use the one-time password (OTP) below.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC; text-align: center;">
        <p style="font-size: 14px; color: #666; margin: 0 0 15px 0;">Your OTP is:</p>
        <p style="font-size: 32px; font-weight: bold; color: #5B86E5; margin: 0; letter-spacing: 2px;">${otp}</p>
        <p style="font-size: 12px; color: #999; margin: 15px 0 0 0;">Expires in ${expiryMinutes} minutes</p>
      </div>
      
      <p style="color: #666; font-size: 14px; margin: 20px 0;">This OTP is valid for ${expiryMinutes} minutes. Please do not share this code with anyone.</p>
      
      <p style="color: #666; font-size: 14px; margin: 20px 0;">If you didn't request this email, please ignore it or contact our support team.</p>
      
      <p style="margin-bottom: 5px;">Best regards,<br>The SamvaadX Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 SamvaadX. All rights reserved.</p>
    </div>
  </body>
  </html>
  `
}

export function createEmailVerificationTemplate(name, verificationLink, tokenExpiry) {
  const expiryHours = Math.round(tokenExpiry / (1000 * 60 * 60))

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - SamvaadX</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Verify Your Email</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>Thank you for signing up! To complete your registration and start using SamvaadX, please verify your email address by clicking the button below.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
        <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Why verify your email?</strong></p>
        <ul style="padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 10px;">Secure your account</li>
          <li style="margin-bottom: 10px;">Receive important notifications</li>
          <li style="margin-bottom: 0;">Access all features of SamvaadX</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Verify Email Address</a>
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 20px;">This verification link will expire in <strong>${expiryHours} hours</strong>. If you didn't create an account, please ignore this email.</p>
      
      <p style="margin-bottom: 5px;">If you have any questions, we're here to help.</p>
      <p style="margin-top: 0;">Best regards,<br>The SamvaadX Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 SamvaadX. All rights reserved.</p>
    </div>
  </body>
  </html>
  `
}

export function createPasswordResetOTPTemplate(name, otp, otpExpiry) {
  const expiryMinutes = Math.round(otpExpiry / (1000 * 60))

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - SamvaadX</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Password Reset</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
      <p>We received a request to reset your password for your SamvaadX account. Use the OTP below to reset your password.</p>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC; text-align: center;">
        <p style="font-size: 14px; color: #666; margin: 0 0 15px 0;">Your OTP is:</p>
        <p style="font-size: 32px; font-weight: bold; color: #5B86E5; margin: 0; letter-spacing: 2px;">${otp}</p>
        <p style="font-size: 12px; color: #999; margin: 15px 0 0 0;">Expires in ${expiryMinutes} minutes</p>
      </div>
      
      <p style="color: #666; font-size: 14px; margin: 20px 0;">This OTP is valid for ${expiryMinutes} minutes. Please do not share this code with anyone.</p>
      
      <p style="color: #666; font-size: 14px; margin: 20px 0;">If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
      
      <p style="margin-bottom: 5px;">Best regards,<br>The SamvaadX Team</p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 SamvaadX. All rights reserved.</p>
    </div>
  </body>
  </html>
  `
}













// export function createWelcomeEmailTemplate(name, clientURL) {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Welcome to Messenger</title>
//   </head>
//   <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
//     <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
//       <img src="https://img.freepik.com/free-vector/hand-drawn-message-element-vector-cute-sticker_53876-118344.jpg?t=st=1741295028~exp=1741298628~hmac=0d076f885d7095f0b5bc8d34136cd6d64749455f8cb5f29a924281bafc11b96c&w=1480" alt="Messenger Logo" style="width: 80px; height: 80px; margin-bottom: 20px; border-radius: 50%; background-color: white; padding: 10px;">
//       <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to Messenger!</h1>
//     </div>
//     <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
//       <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${name},</strong></p>
//       <p>We're excited to have you join our messaging platform! Messenger connects you with friends, family, and colleagues in real-time, no matter where they are.</p>
      
//       <div style="background-color: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #36D1DC;">
//         <p style="font-size: 16px; margin: 0 0 15px 0;"><strong>Get started in just a few steps:</strong></p>
//         <ul style="padding-left: 20px; margin: 0;">
//           <li style="margin-bottom: 10px;">Set up your profile picture</li>
//           <li style="margin-bottom: 10px;">Find and add your contacts</li>
//           <li style="margin-bottom: 10px;">Start a conversation</li>
//           <li style="margin-bottom: 0;">Share photos, videos, and more</li>
//         </ul>
//       </div>
      
//       <div style="text-align: center; margin: 30px 0;">
//         <a href=${clientURL} style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">Open Messenger</a>
//       </div>
      
//       <p style="margin-bottom: 5px;">If you need any help or have questions, we're always here to assist you.</p>
//       <p style="margin-top: 0;">Happy messaging!</p>
      
//       <p style="margin-top: 25px; margin-bottom: 0;">Best regards,<br>The Messenger Team</p>
//     </div>
    
//     <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
//       <p>© 2025 Messenger. All rights reserved.</p>
//       <p>
//         <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
//         <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
//         <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Contact Us</a>
//       </p>
//     </div>
//   </body>
//   </html>
//   `;
// }

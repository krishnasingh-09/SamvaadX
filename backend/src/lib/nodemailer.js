import nodemailer from "nodemailer"
import { ENV } from "./env.js"

let transporter

const NODE_ENV = process.env.NODE_ENV || "development"

console.log("[DEBUG] NODE_ENV:", NODE_ENV)
console.log("[DEBUG] process.env.GMAIL_USER:", process.env.GMAIL_USER ? "✓ Set" : "✗ Not set")
console.log("[DEBUG] process.env.GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "✓ Set" : "✗ Not set")
console.log("[DEBUG] ENV.GMAIL_USER from env.js:", ENV.GMAIL_USER ? "✓ Set" : "✗ Not set")
console.log("[DEBUG] ENV.GMAIL_APP_PASSWORD from env.js:", ENV.GMAIL_APP_PASSWORD ? "✓ Set" : "✗ Not set")

const gmailUser = ENV.GMAIL_USER
const gmailPassword = ENV.GMAIL_APP_PASSWORD

const createGmailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  })

if (NODE_ENV === "production") {
  if (!gmailUser || !gmailPassword) {
    console.warn("⚠️ Email credentials missing. Falling back to JSON transport.")
    transporter = nodemailer.createTransport({ jsonTransport: true })
  } else {
    transporter = createGmailTransport()
    console.log("📧 Using Gmail SMTP for production emails")
  }
} else {
  if (gmailUser && gmailPassword) {
    transporter = createGmailTransport()
    console.log("📧 Using Gmail SMTP for development emails")
  } else {
    transporter = nodemailer.createTransport({ jsonTransport: true })
    console.log("📧 Using JSON transport for development")
  }
}

transporter.verify((error) => {
  if (error) {
    console.log("❌ Nodemailer config error:", error.message)
  } else {
    console.log("✓ Nodemailer ready")
  }
})

export default transporter




// import nodemailer from "nodemailer"
// import { ENV } from "./env.js"

// let transporter

// const NODE_ENV = process.env.NODE_ENV || "development"

// console.log("[DEBUG] NODE_ENV:", NODE_ENV)
// console.log("[DEBUG] process.env.GMAIL_USER:", process.env.GMAIL_USER ? "✓ Set" : "✗ Not set")
// console.log("[DEBUG] process.env.GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "✓ Set" : "✗ Not set")
// console.log("[DEBUG] ENV.GMAIL_USER from env.js:", ENV.GMAIL_USER ? "✓ Set" : "✗ Not set")
// console.log("[DEBUG] ENV.GMAIL_APP_PASSWORD from env.js:", ENV.GMAIL_APP_PASSWORD ? "✓ Set" : "✗ Not set")

// const gmailUser = ENV.GMAIL_USER
// const gmailPassword = ENV.GMAIL_APP_PASSWORD

// /**
//  * PRODUCTION
//  * Uses real Gmail SMTP (or later SendGrid / Resend)
//  */
// if (NODE_ENV === "production") {
//   if (!gmailUser || !gmailPassword) {
//     console.warn("⚠️ Email credentials missing. Falling back to JSON transport.")

//     transporter = nodemailer.createTransport({
//       jsonTransport: true,
//     })
//   } else {
//     transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: gmailUser,
//         pass: gmailPassword,
//       },
//     })
//     console.log("📧 Using Gmail for production emails")
//   }
// } else {
//   /**
//    * DEVELOPMENT
//    * Now uses Gmail in development too if credentials are available
//    */
//   if (gmailUser && gmailPassword) {
//     transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: gmailUser,
//         pass: gmailPassword,
//       },
//     })
//     console.log("📧 Using Gmail for development emails")
//   } else {
//     transporter = nodemailer.createTransport({
//       jsonTransport: true,
//     })
//     console.log("📧 Using JSON transport for development (emails logged to console)")
//   }
// }

// /**
//  * Verify transport (non-fatal)
//  */
// transporter.verify((error) => {
//   if (error) {
//     console.log("❌ Nodemailer config error:", error.message)
//   } else {
//     console.log("✓ Nodemailer ready")
//   }
// })

// export default transporter

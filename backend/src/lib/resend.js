import { Resend } from "resend";
import { ENV } from "./env.js"; // ✅ THIS IS THE FIX

let resend = null;

if (ENV.RESEND_API_KEY) {
  resend = new Resend(ENV.RESEND_API_KEY);
  console.log("📧 Resend initialized");
} else {
  console.warn("⚠️ RESEND_API_KEY not set. Emails disabled.");
}

const sender = {
  name: ENV.EMAIL_FROM_NAME || "SamvaadX",
  email: ENV.EMAIL_FROM || "onboarding@resend.dev",
};

export { resend, sender };

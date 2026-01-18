import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sender = {
  name: process.env.EMAIL_FROM_NAME || "SamvaadX",
  email: process.env.EMAIL_FROM || "onboarding@resend.dev",
};

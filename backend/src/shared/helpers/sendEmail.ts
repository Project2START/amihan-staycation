import nodemailer from "nodemailer";
import { AppError } from "./appErrors";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// This function sends an email with details based on received parameters
export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Amihan Staycation" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
      attachments,
    });

    return info;
  } catch (error) {
    throw new AppError("Email could not be sent. Please try again later.");
  }
}

import nodemailer from "nodemailer";
import { AppError } from "./appErrors";

/**
 * Sends an email using the configured Nodemailer transporter. Supports HTML,
 * plain text, and optional attachments. Throws a user-friendly AppError if the
 * email fails to send.
 *
 * @param to - Recipient email address.
 * @param subject - Email subject line.
 * @param html - Optional HTML body content.
 * @param text - Optional plain text body content.
 * @param attachments - Optional list of email attachments.
 * @returns The Nodemailer `info` object containing delivery details.
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

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
  } catch (error: any) {
    console.error("[sendEmail] Error sending email:");
    if (error instanceof Error) {
      console.error("Message:", error.message);
      if (error.stack) console.error("Stack:", error.stack);
    }
    if (error?.response) {
      console.error("SMTP Response:", error.response);
    }
    if (error?.code) {
      console.error("Error Code:", error.code);
    }
    if (error?.command) {
      console.error("SMTP Command:", error.command);
    }
    if (error?.errno) {
      console.error("Errno:", error.errno);
    }
    if (error?.address) {
      console.error("Address:", error.address);
    }
    if (error?.port) {
      console.error("Port:", error.port);
    }
    // Log the full error object for deep inspection
    console.error("Full error object:", error);
    // Log SMTP-related environment variables for debugging
    console.error("SMTP ENV CONFIG:", {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_SECURE: process.env.SMTP_SECURE,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS ? "[HIDDEN]" : undefined,
    });
    throw new AppError("Email could not be sent. Please try again later.");
  }
}

import nodemailer from "nodemailer";
import { google } from "googleapis";
import { AppError } from "./appErrors";

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
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
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token!,
      },
    });

    const info = await transporter.sendMail({
      from: `"Amihan Staycation" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      text,
      attachments,
    });

    return info;
  } catch (error) {
    console.error("[sendEmail] Error:", error);
    throw new AppError("Email could not be sent. Please try again later.");
  }
}

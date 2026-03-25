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

function buildRawEmail({
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
}): string {
  const boundary = `boundary_${Date.now()}`;

  const lines: string[] = [
    `From: "Amihan Staycation" <${process.env.GMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/related; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`, // ← removed quoted-printable encoding
    ``,
    html || text || "", // ← raw HTML directly, no encoding
  ];

  if (attachments && attachments.length > 0) {
    for (const attachment of attachments) {
      const filename = attachment.filename || "attachment";
      const contentType = attachment.contentType || "application/octet-stream";
      const cid = attachment.cid;

      let content: string;
      if (attachment.content) {
        content =
          attachment.content instanceof Buffer
            ? attachment.content.toString("base64")
            : Buffer.from(attachment.content).toString("base64");
      } else if (attachment.path) {
        const fs = require("fs");
        content = fs.readFileSync(attachment.path).toString("base64");
      } else {
        continue;
      }

      lines.push(`--${boundary}`);
      lines.push(`Content-Type: ${contentType}; name="${filename}"`);
      lines.push(`Content-Transfer-Encoding: base64`);
      lines.push(`Content-Disposition: inline; filename="${filename}"`);
      if (cid) {
        lines.push(`Content-ID: <${cid}>`);
        lines.push(`X-Attachment-Id: ${cid}`);
      }
      lines.push(``);
      lines.push(content);
    }
  }

  lines.push(`--${boundary}--`);

  return Buffer.from(lines.join("\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

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
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const encodedMessage = buildRawEmail({
      to,
      subject,
      html,
      text,
      attachments,
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });
  } catch (error) {
    console.error("[sendEmail] Error:", error);
    throw new AppError("Email could not be sent. Please try again later.");
  }
}

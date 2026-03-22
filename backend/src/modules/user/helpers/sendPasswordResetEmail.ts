import path from "path";
import { loadTemplate } from "../../../shared/helpers/loadTemplate";
import { sendEmail } from "../../../shared/helpers/sendEmail";

export async function sendPasswordResetEmail({
  email,
  resetLink,
  expiresInMinutes,
}: {
  email: string;
  resetLink: string;
  expiresInMinutes: number;
}) {
  const templatePath = path.resolve(
    process.cwd(),
    "src/templates/passwordReset.html",
  );

  const html = loadTemplate(templatePath, {
    resetLink,
    year: `${new Date().getFullYear()}`,
    expiresInMinutes: `${expiresInMinutes}`,
  });

  await sendEmail({
    to: email,
    subject: "Reset your Amihan Staycation password",
    html,
    text: [
      "We received a request to reset your password.",
      `Reset link: ${resetLink}`,
      `This link expires in ${expiresInMinutes} minutes.`,
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    attachments: [
      {
        filename: "Amihan Staycation Logo",
        path: path.resolve(
          process.cwd(),
          "public/amihan-staycation-mainLogo.png",
        ),
        cid: "logo",
      },
    ],
  });
}

import path from "path";
import { loadTemplate } from "../../../shared/helpers/loadTemplate";
import { sendEmail } from "../../../shared/helpers/sendEmail";
import { presentVerificationText } from "./presenters/presentVerificationText";

export async function sendVerificationCode(
  verificationCode: string,
  email: string,
) {
  const templatePath = path.resolve(
    process.cwd(),
    "src/templates/emailVerification.html",
  );

  const html = loadTemplate(templatePath, {
    otp: `${verificationCode}`,
    year: `${new Date().getFullYear()}`,
  });

  await sendEmail({
    to: email,
    subject: "Welcome to Amihan Staycation",
    html,
    text: presentVerificationText(verificationCode),
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

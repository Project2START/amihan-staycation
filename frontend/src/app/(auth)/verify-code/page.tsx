import EmailIcon from "@mui/icons-material/Email";
import ResendVerifyLink from "./components/ResendVerifyCode";
import CodeInput from "./components/CodeInput";
import { cookies } from "next/headers";
import HeaderPromptAuth from "@/app/shared/components/HeaderPromptAuth";

export default async function VerifyInfoPage() {
  const cookieStore = await cookies();
  const registree_id = cookieStore.get("registree_id")?.value;

  return (
    <>
      <HeaderPromptAuth />
      <div className="mt-[5rem] mx-[1.5rem] text-xs/5 lg:flex lg:justify-center lg:mt-[3rem]">
        <div className="text-center border-2 border-secondary-normal/30 rounded-lg px-[1.5rem] pt-[0.75rem] pb-[2rem] lg:w-[30%]">
          <div className="mb-[0.5rem]">
            <span className="text-secondary-normal">
              <EmailIcon fontSize="large" />
            </span>
          </div>
          <p>
            Thanks for joining!{" "}
            <strong>A verification code was sent to your email</strong>. Check
            your <strong>inbox or spam folder</strong> to activate your account.
          </p>

          <CodeInput id={registree_id} />

          <ResendVerifyLink id={registree_id} />
        </div>
      </div>
    </>
  );
}

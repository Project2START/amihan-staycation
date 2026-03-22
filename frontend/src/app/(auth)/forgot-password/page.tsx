import HeaderAuth from "@/app/shared/components/HeaderAuth";
import PasswordResetRequestForm from "@/app/shared/components/auth/PasswordResetRequestForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <HeaderAuth />
      <div className="text-sm px-[1rem] my-[4rem] mt-[2.5rem] flex justify-center lg:text-base lg:px-[2rem]">
        <div className="w-full max-w-[34rem] border-1 border-tertiary-normal/30 rounded-lg px-[1rem] py-[1.5rem] sm:px-[1.5rem] lg:px-[2rem] lg:py-[2rem]">
          <div className="text-secondary-normal text-center mb-[1rem]">
            <h1 className="text-xl font-bold lg:text-3xl">Forgot Password?</h1>
            <p className="py-[0.5rem] lg:py-[1rem] text-xs lg:text-sm">
              Enter your email and we will send you a secure reset link.
            </p>
          </div>

          <PasswordResetRequestForm source="auth" />
        </div>
      </div>
    </>
  );
}

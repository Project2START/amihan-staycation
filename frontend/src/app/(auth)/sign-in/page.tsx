import AuthHeader from "@/app/shared/components/AuthHeader";
import SignInForm from "./components/SignInForm";

export default function SignInPage() {
  return (
    <>
      <AuthHeader />
      <div className="px-[2rem] my-[5rem] flex justify-center lg:mt-[3rem]">
        <div className=" md:w-[60%] lg:w-[35%] lg:border-1 lg:border-tertiary-normal/30 lg:px-[2rem] lg:pt-[3rem] lg:pb-[1.5rem] lg:rounded-lg">
          <div className="text-secondary-normal text-center">
            <h1 className="text-xl font-bold">Welcome back!</h1>
            <p className="text-xs py-[0.5rem]">
              Sign in and continue your AStaycation experience.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </>
  );
}

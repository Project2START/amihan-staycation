import HeaderAuth from "@/app/shared/components/HeaderAuth";
import SignInForm from "./components/SignInForm";

export default function SignInPage() {
  return (
    <>
      <HeaderAuth />
      <div className="text-sm px-[2rem] my-[5rem] mt-[3rem] flex justify-center lg:text-base">
        <div className="w-full md:w-[60%] lg:w-[35%] lg:border-1 lg:border-tertiary-normal/30 lg:px-[2rem] lg:pt-[3rem] lg:pb-[1.5rem] lg:rounded-lg">
          <div className="text-secondary-normal text-center">
            <h1 className="text-xl font-bold lg:text-3xl">Welcome back!</h1>
            <p className="py-[0.5rem] lg:py-[1rem]">
              Continue your AStaycation — sign in.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    </>
  );
}

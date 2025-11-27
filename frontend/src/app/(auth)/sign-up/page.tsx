import AuthHeader from "@/app/shared/components/AuthHeader";
import SignUpForm from "./components/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <AuthHeader />
      <div className="px-[2rem] my-[5rem] flex justify-center lg:mt-[3rem]">
        <div className=" md:w-[60%] lg:w-[35%] lg:border-1 lg:border-tertiary-normal/30 lg:px-[2rem] lg:py-[3rem] lg:rounded-lg">
          <div className="text-secondary-normal text-center">
            <h1 className="text-xl font-bold">Create new account</h1>
            <p className="text-xs py-[0.5rem]">
              Join AStaycation ━ your getaway begins here!
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}

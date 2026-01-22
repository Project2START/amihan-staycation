import SignUpForm from "./components/SignUpForm";
import HeaderAuth from "@/app/shared/components/HeaderAuth";

export default function SignUpPage() {
  return (
    <>
      <HeaderAuth />
      <div className="text-sm px-[2rem] my-[5rem] mt-[3rem] flex justify-center lg:text-base">
        <div className=" md:w-[60%] lg:w-[35%] lg:border-1 lg:border-tertiary-normal/30 lg:px-[3rem] lg:py-[3rem] lg:rounded-lg">
          <div className="text-secondary-normal text-center">
            <h1 className="text-xl font-bold lg:text-3xl">
              Create new account
            </h1>
            <p className="py-[0.5rem] lg:py-[1rem]">
              Join AStaycation ━ your getaway begins here!
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}

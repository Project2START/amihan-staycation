import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div className="px-[2rem]">
      <div className="text-secondary-normal mt-[4rem] text-center">
        <h1 className="text-xl font-bold">Create new account</h1>
        <p className="text-xs py-[0.5rem]">
          Join AStaycation ━ your getaway begins here!
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}

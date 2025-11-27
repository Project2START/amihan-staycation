import Link from "next/link";
import ImageMainLogo from "./ImageMainLogo";

export default function PropmptAuthHeader() {
  return (
    <div className="shadow-md/30 bg-white p-[1rem] md:px-[2rem]">
      <div className="flex justify-between items-center">
        <ImageMainLogo />

        <div className="flex text-xs">
          <Link
            href={"/sign-up"}
            className="px-[1.75rem] py-[0.75rem] bg-primary-normal font-bold rounded-xl text-white hover-animation hover:opacity-80"
          >
            <span>Sign Up</span>
          </Link>
          <Link
            href={"/sign-in"}
            className="px-[1rem] py-[0.75rem] font-bold text-primary-normal text-shadow-lg hover-animation hover:opacity-80"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

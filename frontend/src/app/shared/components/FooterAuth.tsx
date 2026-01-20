import Link from "next/link";

export default function FooterAuth() {
  return (
    <footer>
      <div className="bg-secondary-normal text-white text-[0.65rem] px-[1.5rem] py-[2rem] text-center lg:text-sm lg:py-[3.5rem]">
        <p className="font-bold">
          By signing in or creating an account, you agree with our {" "}
          <Link href={""} className="text-primary-normal">
            Terms & conditions
          </Link>
           and 
          <Link href={""} className="text-primary-normal">
            Privacy statement
          </Link>
        </p>
        <p className="mt-[1rem]">
          All rights reserved. Copyright (2025-2026) - AStaycation.com™
        </p>
      </div>
    </footer>
  );
}

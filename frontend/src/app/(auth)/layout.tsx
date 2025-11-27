import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main className="grow">{children}</main>
      <footer>
        <div className="bg-secondary-normal text-white text-[0.65rem] p-[1.5rem] text-center">
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
    </>
  );
}

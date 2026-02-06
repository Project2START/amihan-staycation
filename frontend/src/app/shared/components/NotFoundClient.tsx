"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderAuth from "./HeaderAuth";
import FooterMain from "./FooterMain";

export default function NotFoundClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <HeaderAuth />
      </div>

      <div className="text-secondary-normal text-sm text-center p-6 grow flex flex-col justify-center items-center">
        <h1 className="mb-4 text-xl font-semibold">404 - Page Not Found</h1>

        <p className="mb-4">
          Oops! The page you are looking for does not exist.
        </p>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => router.back()}
          >
            Go Back
          </button>

          <Link
            href="/"
            className="px-4 py-2 text-white bg-primary-normal rounded hover:bg-blue-600"
          >
            Home
          </Link>
        </div>
      </div>

      <div>
        <FooterMain />
      </div>
    </div>
  );
}

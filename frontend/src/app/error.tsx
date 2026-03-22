"use client";

import { useRouter } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";

export default function Error({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-72px)] px-[1.5rem] text-center gap-y-4">
      <span className="text-reject-normal text-5xl">
        <MdErrorOutline />
      </span>

      <h2 className="text-secondary-normal">Something went wrong!</h2>
      <p className="text-secondary-normal/60 text-sm max-w-[24rem]">
        An unexpected error occurred. You can try again or go back to the
        previous page.
      </p>

      <div className="flex gap-x-3 mt-2 w-full max-w-[20rem]">
        <button
          onClick={() => router.back()}
          className="flex-1 py-[0.5rem] rounded-xl border-2 border-secondary-normal/30 hover-animation hover:bg-secondary-normal/5"
        >
          <span className="text-secondary-normal text-xs font-semibold">
            Go Back
          </span>
        </button>
        <button
          onClick={() => reset()}
          className="flex-1 py-[0.5rem] rounded-xl bg-primary-normal hover-animation hover:opacity-90"
        >
          <span className="text-white text-xs font-semibold">Try Again</span>
        </button>
      </div>
    </div>
  );
}

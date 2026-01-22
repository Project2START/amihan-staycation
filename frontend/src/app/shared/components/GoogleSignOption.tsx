"use client";

import { HOST } from "@/app/shared/constants/config";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignOption() {
  const router = useRouter();

  const handleNavigateOAuth = async () => {
    router.push(`${HOST}/api/user/google`);
  };
  return (
    <div className="flex justify-center">
      <div className="w-[100%] border-2 border-secondary-normal/30 rounded-[0.75rem] md:w-[70%] lg:py-[0.5rem]">
        <PrimaryButton
          onClick={handleNavigateOAuth}
          variant="outlined"
          style={{
            background: "none",
            padding: "0.5rem",
            border: "none",
          }}
        >
          <span className="text-xl lg:text-2xl">
            <FcGoogle />
          </span>
          <span className="font-bold text-gray-500 ml-[0.5rem] lg:text-base">
            Google
          </span>
        </PrimaryButton>
      </div>
    </div>
  );
}

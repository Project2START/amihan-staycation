"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useRouter } from "next/navigation";

export default function AgentViewHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-6 mt-3 md:mb-8 md:mt-4 lg:mb-10">
      <div className="flex-1/3">
        <PrimaryBackButton
          style="text-xl text-secondary-normal"
          onClick={() => router.back()}
        />
      </div>

      <h1 className="text-lg font-bold text-secondary-normal flex-1/3 text-center">
        Your Agent
      </h1>
      <span className="flex-1/3"></span>
    </div>
  );
}

"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useRouter } from "next/navigation";

export default function ClientBackButton() {
  const router = useRouter();
  return <PrimaryBackButton onClick={() => router.back()} style="text-xl" />;
}

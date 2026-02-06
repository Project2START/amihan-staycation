"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useAppSelector } from "@/lib/hooks";

import { useRouter } from "next/navigation";

export default function UserProductHeader({ name }: { name: string }) {
  const user = useAppSelector((state) => state.users.data);

  const router = useRouter();

  return (
    <div className="flex justify-between items-center py-[1.5rem]">
      <div className="flex-1/4">
        <PrimaryBackButton
          onClick={() => {
            router.push(`/units?user=${user?.id}`);
          }}
          style="text-xl"
        />
      </div>
      <div className="flex-2/4 overflow-x-hidden">
        <h1 className="text-center truncate" title={name}>
          {name}
        </h1>
      </div>
      <div className="flex-1/4"></div>
    </div>
  );
}

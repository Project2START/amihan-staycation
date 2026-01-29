"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useRouter } from "next/navigation";
import { CiSettings } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ProductHeader({ name }: { name: string; id: string }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center py-[1.5rem]">
      <div className="flex-1/4">
        <PrimaryBackButton
          onClick={() => {
            router.back();
          }}
          style="text-xl"
        />
      </div>
      <div className="flex-2/4 overflow-x-hidden">
        <h1 className="text-center truncate" title={name}>
          {name}
        </h1>
      </div>
      <div className="flex-1/4 flex justify-center items-center gap-x-3">
        <div>
          <button>
            <span className="text-xl text-gray-500">
              <CiSettings />
            </span>
          </button>
        </div>
        <div>
          <button>
            <span className="text-xl text-gray-500">
              <GoPencil />
            </span>
          </button>
        </div>
        <div>
          <button>
            <span className="text-xl text-reject-normal">
              <RiDeleteBin6Line />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

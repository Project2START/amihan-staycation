"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";

export default function BackPrevPage() {
  const [goBackDialog, setGoBackDialog] = useState(false);

  const router = useRouter();

  return (
    <>
      <PrimaryBackButton
        onClick={() => {
          setGoBackDialog(true);
        }}
        style="text-xl"
      />

      <DialogBaseContent
        openDialog={goBackDialog}
        onCloseDialog={() => {
          setGoBackDialog(false);
        }}
      >
        <div className="px-[2rem] pt-[1.5rem] pb-[1rem] text-sm">
          <p className="text-center flex items-center">
            <span>
              Do you want to{" "}
              <strong className="text-reject-normal">exit</strong> this form?{" "}
              <strong>Your changes won’t be saved.</strong>
            </span>
          </p>
          <div className="flex justify-center gap-x-8 items-center mt-[1rem]">
            <div>
              <button type="button" onClick={() => setGoBackDialog(false)}>
                No
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => router.push(`/units`)}
                className="bg-secondary-normal font-bold px-[2rem] py-[0.25rem] text-white rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </DialogBaseContent>
    </>
  );
}

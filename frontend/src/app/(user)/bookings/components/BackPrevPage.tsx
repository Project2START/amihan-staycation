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
        <div className="p-5 text-sm lg:p-7">
          <p className="text-center flex items-center justify-center lg:text-base">
            {/* <span className="text-reject-normal text-2xl">
                  <IoIosAlert />
                </span> */}
            <span>
              Do you want to{" "}
              <strong className="text-reject-normal">exit</strong> this form?{" "}
              <strong>Your changes won’t be saved.</strong>
            </span>
          </p>
          <div className="flex justify-center gap-x-8 items-center mt-[1rem] lg:text-base">
            <div>
              <button type="button" onClick={() => setGoBackDialog(false)}>
                No
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => router.back()}
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

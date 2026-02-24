"use client";

import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { IoIosAlert } from "react-icons/io";

export default function DeletePaymentMethod({
  open,
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <DialogBaseContent openDialog={open} onCloseDialog={onClose}>
      <div className="px-[2rem] pt-[1.5rem] pb-[1rem] text-sm text-secondary-normal">
        <p className="text-center flex items-center">
          <span className="text-reject-normal text-2xl">
            <IoIosAlert />
          </span>
          <span>
            Delete this payment method? <b>This can&apos;t be undone.</b>
          </span>
        </p>
        <div className="flex justify-center gap-x-8 items-center mt-[1rem]">
          <div>
            <button disabled={loading} onClick={onClose}>
              No
            </button>
          </div>
          <div>
            <LoadingOverlay loading={loading}>
              <button
                disabled={loading}
                onClick={onConfirm}
                className="bg-reject-normal font-bold px-[2rem] py-[0.25rem] text-white rounded-lg"
              >
                Yes
              </button>
            </LoadingOverlay>
          </div>
        </div>
      </div>
    </DialogBaseContent>
  );
}

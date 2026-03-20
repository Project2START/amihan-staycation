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
      <div className="px-[2rem] md:px-[3rem] lg:px-[4rem] pt-[1.5rem] md:pt-[2rem] lg:pt-[2.5rem] pb-[1rem] md:pb-[1.5rem] lg:pb-[2rem] text-sm text-secondary-normal">
        <p className="text-center flex items-center justify-center gap-x-2 md:gap-x-3 lg:text-base">
          <span>
            Delete this payment method? <b>This can&apos;t be undone.</b>
          </span>
        </p>
        <div className="flex justify-center gap-x-8 md:gap-x-10 lg:gap-x-12 items-center mt-[1.5rem] md:mt-6">
          <div>
            <button
              disabled={loading}
              onClick={onClose}
              className="md:text-base lg:text-lg px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              No
            </button>
          </div>
          <div>
            <LoadingOverlay loading={loading}>
              <button
                disabled={loading}
                onClick={onConfirm}
                className="bg-reject-normal font-bold px-[2rem] md:px-[2.5rem] lg:px-[3rem] py-[0.25rem] md:py-[0.5rem] lg:py-[0.75rem] text-white rounded-lg text-sm md:text-base lg:text-lg"
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

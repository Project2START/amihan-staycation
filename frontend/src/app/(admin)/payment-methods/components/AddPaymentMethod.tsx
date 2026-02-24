"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import AddPaymentForm from "./AddPaymentForm";

export default function AddPaymentMethod() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      {/* Floating add button */}
      <button
        onClick={() => setOpenDialog(true)}
        className="fixed bottom-25 right-6 w-12 h-12 rounded-full bg-primary-normal text-white flex items-center justify-center shadow-xl  cursor-pointer z-50"
        aria-label="Add payment method"
      >
        <FiPlus size={24} />
      </button>

      {/* Dialog */}
      <DialogBaseContent
        openDialog={openDialog}
        onCloseDialog={() => setOpenDialog(false)}
        enableClickOutside={false}
      >
        <AddPaymentForm onCloseDialog={() => setOpenDialog(false)} />
      </DialogBaseContent>
    </>
  );
}

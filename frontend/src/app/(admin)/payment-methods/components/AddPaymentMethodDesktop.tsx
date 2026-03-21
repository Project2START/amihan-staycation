"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import AddPaymentForm from "./AddPaymentForm";

export default function AddPaymentMethodDesktop() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="hidden md:flex items-center">
        <PrimaryButton onClick={() => setOpenDialog(true)}>
          <div className="flex items-center gap-2 px-1 lg:px-2">
            <FiPlus size={18} />
            <span className="text-sm lg:text-sm font-semibold normal-case">
              Add Payment Method
            </span>
          </div>
        </PrimaryButton>
      </div>

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

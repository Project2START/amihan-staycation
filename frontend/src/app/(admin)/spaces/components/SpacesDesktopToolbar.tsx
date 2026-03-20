"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import NewUnitForm from "./NewUnitForm";

export default function SpacesDesktopToolbar() {
  const [addNew, setAddNew] = useState(false);

  return (
    <>
      <div className="hidden lg:mx-auto lg:mb-6 lg:flex lg:w-full lg:max-w-[1280px] lg:items-center lg:justify-between lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-6 lg:py-5 lg:shadow-sm">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-secondary-normal/60">
            Space Management
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-secondary-normal">
            Your Staycation Spaces
          </h1>
          <p className="mt-1 text-sm text-secondary-normal/70">
            Review, update, and manage your units in one workspace.
          </p>
        </div>

        <button
          onClick={() => setAddNew(true)}
          className="inline-flex items-center gap-x-2 rounded-xl bg-primary-normal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <FaPlus />
          <span>Add New Unit</span>
        </button>
      </div>

      <DialogBaseContent
        onCloseDialog={() => setAddNew(false)}
        openDialog={addNew}
        enableClickOutside={false}
        scrollVertically={false}
      >
        <NewUnitForm onCloseDialog={() => setAddNew(false)} />
      </DialogBaseContent>
    </>
  );
}

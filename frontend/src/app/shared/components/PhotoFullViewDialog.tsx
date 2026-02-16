"use client";

import { useState } from "react";
import DialogBaseContent from "../ui/DialogBaseContent";
import PhotoFullView from "./PhotoFullView";

export default function PhotoFullViewDialog({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button type="button" className="w-full" onClick={handleOpen}>
        {children}
      </button>

      <DialogBaseContent
        onCloseDialog={handleClose}
        openDialog={open}
        enableClickOutside={true}
      >
        <PhotoFullView photoSrc={url} onCloseDialog={handleClose} />
      </DialogBaseContent>
    </>
  );
}

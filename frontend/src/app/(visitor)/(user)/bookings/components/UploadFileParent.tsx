"use client";

import { useFormContext } from "react-hook-form";
import UploadFilePhoto from "./UploadFilePhoto";
import { BookingSchema } from "../schema/bookings.schema";
import { useEffect } from "react";

export default function UploadFileParent() {
  const {
    formState: { errors },
    watch,
    setValue,
    setFocus,
    clearErrors,
  } = useFormContext<BookingSchema>();

  const valid_id_file = watch("valid_id");

  useEffect(() => {
    if (errors.valid_id) {
      setFocus("valid_id");
    }
  }, [setFocus, errors.valid_id]);

  return (
    <div>
      <UploadFilePhoto
        uploadTextContent="Valid ID"
        url={valid_id_file?.url}
        onSelectPhoto={(photoFile) => {
          setValue("valid_id", photoFile);
          clearErrors("valid_id");
        }}
        onDeletePhoto={() => {
          setValue("valid_id", { file: undefined, id: "", url: "" });
        }}
        fieldName="valid_id"
      />
      {errors.valid_id && (
        <p className="text-red-900 text-[0.65rem]" id="guestValidId-error">
          Valid ID is required
        </p>
      )}
    </div>
  );
}

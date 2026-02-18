"use client";

import { useFormContext } from "react-hook-form";
import UploadFilePhoto from "./UploadFilePhoto";
import { BookingSchema } from "../schema/bookings.schema";
import { useEffect } from "react";

export default function UploadPaymentScreenshot() {
  const {
    formState: { errors },
    watch,
    setValue,
    setFocus,
    clearErrors,
  } = useFormContext<BookingSchema>();

  const payment_proof_file = watch("payment_proof");

  useEffect(() => {
    if (errors.payment_proof) {
      setFocus("payment_proof");
    }
  }, [setFocus, errors.payment_proof]);

  return (
    <div>
      <UploadFilePhoto
        uploadTextContent="Upload Payment Screenshot"
        url={payment_proof_file?.url}
        onSelectPhoto={(photoFile) => {
          setValue("payment_proof", photoFile);
          clearErrors("payment_proof");
        }}
        onDeletePhoto={() => {
          setValue("payment_proof", { file: undefined, id: "", url: "" });
        }}
        fieldName="payment_proof"
      />
      {errors.payment_proof && (
        <p className="text-red-900 text-[0.65rem]" id="guestPaymentProof-error">
          A proof of security deposit is required
        </p>
      )}
    </div>
  );
}

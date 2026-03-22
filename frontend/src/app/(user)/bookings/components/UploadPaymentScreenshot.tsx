"use client";

import { useFormContext } from "react-hook-form";
import UploadFilePhoto from "./UploadFilePhoto";
import { BookingSchema } from "../schema/bookings.schema";
import { useEffect } from "react";
import { FaArrowDown } from "react-icons/fa6";

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
      {errors.payment_proof && (
        <p
          className="text-red-900 text-[0.65rem] flex items-center gap-x-1"
          id="guestPaymentProof-error"
        >
          <span>A proof of security deposit is required</span>
          <span>
            <FaArrowDown />
          </span>
        </p>
      )}
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
    </div>
  );
}

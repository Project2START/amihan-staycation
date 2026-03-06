"use client";

import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";

export default function ConfirmBooking({
  prevStep,
  confirmLoading,
}: {
  prevStep: () => void;
  confirmLoading: boolean;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BookingSchema>();

  const agree_terms = useWatch({ control, name: "agree_terms" });

  return (
    <div className="px-[0.25rem]">
      <div className="flex items-start gap-x-2">
        <input
          type="checkbox"
          {...register("agree_terms")}
          className="accent-secondary-normal scale-125 mt-[0.25rem]"
          disabled={confirmLoading}
          //   style={{ width: "1rem", height: "1rem" }}
        />
        <p className="leading-5">
          By confirming this booking, you acknowledge that all information
          provided is accurate and final. Please review your details carefully,
          as incorrect information may affect your reservation. See our{" "}
          <Link href={"/about/terms-and-conditions"}>
            <span className="underline font-bold">Terms & Conditions</span>
          </Link>{" "}
          and{" "}
          <Link href={"/about/privacy-policy"}>
            <span className="underline font-bold">Privacy Policy.</span>
          </Link>
        </p>
      </div>
      <div className="flex justify-center gap-x-10 font-bold mt-[1.5rem]">
        <button
          type="button"
          className="text-primary-normal py-[0.5rem] px-[1.5rem] rounded-lg"
          onClick={prevStep}
          disabled={confirmLoading}
        >
          <span>Back</span>
        </button>
        <LoadingOverlay loading={confirmLoading}>
          <button
            className="bg-primary-normal text-white py-[0.5rem] px-[2.5rem] rounded-lg"
            disabled={!agree_terms || confirmLoading}
          >
            <span>Confirm Booking</span>
          </button>
        </LoadingOverlay>
      </div>
    </div>
  );
}

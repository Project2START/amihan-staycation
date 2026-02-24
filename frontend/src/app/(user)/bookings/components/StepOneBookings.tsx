"use client";

import { useFormContext } from "react-hook-form";
import {
  BookingSchema,
  CONTACT_NUMBER_MAX_LENGTH,
} from "../schema/bookings.schema";
import BookingCalendar from "./BookingCalendar";
import UploadFileParent from "./UploadFileParent";
import SelectNationality from "./SelectNationality";
import PoolAccess from "./PoolAccess";
import WithVehicle from "./WithVehicle";

export default function StepOneBookings() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingSchema>();

  return (
    <div className="h-[60vh] px-[0.75rem] py-[1.5rem] overflow-y-auto shadow-[inset_0_12px_12px_-12px_rgba(0,0,0,0.2),inset_0_-12px_12px_-12px_rgba(0,0,0,0.2)]">
      <div>
        <h2 className="text-center font-normal mb-[1rem]">Primary Guest</h2>
      </div>
      <div className="flex flex-col gap-y-5">
        {/* CHECK IN / CHECK OUT */}
        <BookingCalendar />
        {/* GUEST NAME FIELD */}
        <div className="h-[2.5rem]">
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            aria-describedby={errors.name ? "guestName-error" : undefined}
            className="w-full h-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] input-base-focus"
          />
          {errors.name && (
            <p className="text-red-900 text-[0.65rem]" id="guestName-error">
              {errors.name.message}
            </p>
          )}
        </div>
        {/* GUEST AGE AND NATIONALITY FIELD */}
        <div className="flex items-end justify-between gap-x-5 h-[2.5rem]">
          <div className="flex-1/2 h-full">
            <input
              {...register("age", { valueAsNumber: true })}
              type="number"
              placeholder="Age"
              aria-describedby={errors.age ? "guestAge-error" : undefined}
              onWheel={(e) => e.currentTarget.blur()}
              className="w-full h-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] input-base-focus"
            />
            {errors.age && (
              <p className="text-red-900 text-[0.65rem]" id="guestAge-error">
                {errors.age.message}
              </p>
            )}
          </div>
          <div className="flex-1/2 h-full">
            <SelectNationality />
          </div>
        </div>
        {/* GUEST CONTACT NUMBER FIELD */}
        <div className="h-[2.5rem] mt-[0.5rem]">
          <input
            {...register("contact_number")}
            type="tel"
            inputMode="tel"
            placeholder="Contact number"
            maxLength={CONTACT_NUMBER_MAX_LENGTH}
            aria-describedby={
              errors.contact_number ? "guestContactNumber-error" : undefined
            }
            className="w-full h-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] input-base-focus"
            onKeyDown={(e) => {
              if (
                !/[0-9]/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ].includes(e.key) &&
                !(e.ctrlKey || e.metaKey)
              ) {
                e.preventDefault();
              }
            }}
          />
          {errors.contact_number && (
            <p
              className="text-red-900 text-[0.65rem]"
              id="guestContactNumber-error"
            >
              {errors.contact_number.message}
            </p>
          )}
        </div>
        {/* GUEST VALID PHOTO ID */}
        <div>
          <UploadFileParent />
        </div>

        {/*  GUEST POOL ACCESS */}
        <div>
          <PoolAccess
            hasAccess={"pool_access.hasAccess"}
            name={"pool_access.access"}
          />
        </div>

        {/*  GUEST WITH VEHICLE*/}
        <div>
          <WithVehicle name="with_vehicle" />
        </div>
      </div>
    </div>
  );
}

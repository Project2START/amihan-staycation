"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import CalendarBooking from "@/app/shared/components/CalendarBooking";
import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import SelectNationality from "./SelectNationality";
import PhoneNumberInput from "./PhoneNumberInput";
import { CountryCode } from "libphonenumber-js";
import UploadFilePhoto from "./UploadFilePhoto";
import PoolAccess from "./PoolAccess";
import { DatesRangeValue } from "@mantine/dates";

export default function StepOneBookings() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    resetField,
  } = useFormContext<BookingSchema>();

  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  const valid_id_file = watch("valid_id");

  return (
    <div>
      <div>
        <h2 className="text-center font-normal mb-[1rem]">Primary Guest</h2>
      </div>
      <div className="flex flex-col gap-y-5">
        {/* CHECK IN / CHECK OUT */}
        <div className="relative">
          <button
            type="button"
            className="flex justify-center input-base relative"
            onClick={handleOpenCalendar}
          >
            <div className="flex items-center gap-x-3 font-bold opacity-50">
              <span>Check-in</span>
              <span>—</span>
              <span>Check-out</span>
            </div>

            <div className="absolute right-5 top-[50%] translate-y-[-50%] opacity-50">
              <span className="text-lg">
                <LuCalendarDays />
              </span>
            </div>
          </button>
          <AnimatePresence>
            {openCalendar ? (
              <motion.div
                initial={{ opacity: 0, translateY: "-5%" }}
                animate={{ opacity: 1, translateY: "0%" }}
                exit={{ opacity: 0, translateY: "-5%" }}
                key="user-booking-check-period-calendar"
                data-testid="user-booking-check-period-calendar"
                className="absolute w-[100%] top-[100%] z-999"
              >
                <ClickOutside onClickOutside={handleCloseCalendar}>
                  <CalendarBooking
                    onCalendarChange={(value: DatesRangeValue<string>) => {
                      if (value[0] && value[1])
                        setValue("check_period", {
                          check_in: value[0],
                          check_out: value[1],
                        });
                    }}
                  />
                </ClickOutside>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {/* GUEST NAME FIELD */}
        <div className="h-[2.5rem]">
          <input
            {...register("name")}
            type="text"
            placeholder="Name"
            aria-describedby={errors.name ? "guestName-error" : undefined}
            className="w-full h-full border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
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
              className="w-full h-full border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
            />
            {errors.age && (
              <p className="text-red-900 text-[0.65rem]" id="guestAge-error">
                {errors.age.message}
              </p>
            )}
          </div>
          <div className="flex-1/2 h-full">
            <SelectNationality />

            {errors.nationality && (
              <p
                className="text-red-900 text-[0.65rem]"
                id="guestNationality-error"
              >
                {errors.nationality.message}
              </p>
            )}
          </div>
        </div>
        {/* GUEST CONTACT NUMBER FIELD */}
        <div className="h-[2.5rem] mt-[0.5rem]">
          <PhoneNumberInput
            defaultCountry={
              (watch("contact_number.countryCode") as CountryCode) ?? "PH"
            }
          />
        </div>
        {/* GUEST VALID PHOTO ID */}
        <div>
          <UploadFilePhoto
            uploadTextContent="Valid ID"
            url={valid_id_file?.url}
            onSelectPhoto={(photoFile) => {
              setValue("valid_id", photoFile);
            }}
            onDeletePhoto={() => {
              setValue("valid_id", { file: undefined, id: "", url: "" });
            }}
          />
        </div>

        {/*  GUEST POOL ACCESS */}
        <div>
          <PoolAccess />
        </div>
      </div>
    </div>
  );
}

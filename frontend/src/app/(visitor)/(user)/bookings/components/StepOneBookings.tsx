"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import CalendarBooking from "@/app/shared/components/CalendarBooking";
import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import SelectNationality from "./SelectNationality";
import PhoneFormatter from "./PhoneNumberInput";

export default function StepOneBookings() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingSchema>();

  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  // const disabledDates = [
  //   new Date("2026-02-06 15:15:55.752+00"), // Feb 06, 2026
  //   new Date("2026-02-06 15:15:55.752+00"), // Feb 06, 2026
  // ];

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
                    onCalendarChange={(value) => console.log(value)}
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
        <div className="h-[2.5rem]">
          <PhoneFormatter defaultCountry="JP" />
          {/* <input
            {...register("contact_number")}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Contact Number"
            aria-describedby={
              errors.contact_number ? "guestContactNumber-error" : undefined
            }
            className="w-full h-full border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
          />
          {errors.contact_number && (
            <p
              className="text-red-900 text-[0.65rem]"
              id="guestContactNumber-error"
            >
              {errors.contact_number.message}
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}

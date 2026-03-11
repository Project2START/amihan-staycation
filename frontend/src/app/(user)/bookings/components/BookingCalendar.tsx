"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import dayjs from "dayjs";
import { LuCalendarDays } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import CalendarBooking from "@/app/shared/components/CalendarBooking";
import { DatesRangeValue } from "@mantine/dates";

export default function BookingCalendar() {
  const [openCalendar, setOpenCalendar] = useState(false);

  const {
    formState: { errors },
    control,
    setFocus,
  } = useFormContext<BookingSchema>();

  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  useEffect(() => {
    if (errors.check_period) {
      setFocus("check_period");
    }
  }, [setFocus, errors.check_period]);

  return (
    <div className="relative">
      <Controller
        name="check_period"
        control={control}
        render={({ field }) => {
          const checkPeriod = field.value;
          return (
            <>
              <button
                ref={field.ref}
                type="button"
                className="flex justify-center input-base relative"
                onClick={handleOpenCalendar}
              >
                {!checkPeriod ? (
                  <div className="flex items-center gap-x-3 font-bold opacity-50">
                    <span>Check-in</span>
                    <span>—</span>
                    <span>Check-out</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-3 font-bold">
                    <span>{dayjs(checkPeriod.check_in).format("MMMM DD")}</span>
                    <span>—</span>
                    <span>
                      {dayjs(checkPeriod.check_out).format("MMMM DD")}
                    </span>
                  </div>
                )}

                <div className="absolute right-5 top-[50%] translate-y-[-50%] opacity-50">
                  <span className="text-lg">
                    <LuCalendarDays />
                  </span>
                </div>
              </button>
              {errors.check_period && (
                <p
                  className="text-red-900 text-[0.65rem]"
                  id="guestCheckPeriod-error"
                >
                  Check in and check out date is required
                </p>
              )}
              <AnimatePresence>
                {openCalendar && (
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
                        hasPresets={false}
                        // disabledDates={[
                        //   new Date("2026-03-12"),
                        //   new Date("2026-03-14"),
                        // ]}
                        defaultValue={[
                          checkPeriod?.check_in ?? null,
                          checkPeriod?.check_out ?? null,
                        ]}
                        onCalendarChange={(value: DatesRangeValue<string>) => {
                          if (value[0] && value[1]) {
                            handleCloseCalendar();
                            field.onChange({
                              check_in: value[0],
                              check_out: value[1],
                            });
                          }
                        }}
                      />
                    </ClickOutside>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          );
        }}
      />
    </div>
  );
}

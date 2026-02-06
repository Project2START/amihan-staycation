"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { DatePicker } from "@mantine/dates";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import classes from "@/app/shared/cssModules/Calendar.module.css";

export default function StepOneBookings() {
  const [openCalendar, setOpenCalendar] = useState(false);
  const [calendarValue, setCalendarValue] = useState<
    [string | null, string | null]
  >([null, null]);

  const handleOpenCalendar = () => {
    setOpenCalendar(true);
  };

  const handleCloseCalendar = () => {
    setOpenCalendar(false);
  };

  console.log(classes["mantine-DatePicker-day"]);
  return (
    <div>
      <div>
        <h2 className="text-center font-normal mb-[1rem]">Primary Guest</h2>
      </div>
      <div>
        <div className="relative">
          <button
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
                className="absolute w-max top-[100%] z-999"
              >
                <ClickOutside onClickOutside={handleCloseCalendar}>
                  <div className="bg-white p-[1.5rem] rounded-lg">
                    <div>
                      <DatePicker
                        classNames={{ day: classes.day }}
                        type="range"
                        value={calendarValue}
                        onChange={setCalendarValue}
                      />
                    </div>
                  </div>
                </ClickOutside>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

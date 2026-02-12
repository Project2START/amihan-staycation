"use client";

import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import { getNames, registerLocale } from "i18n-nationality";

registerLocale(require("i18n-nationality/langs/en.json"));

const nationalities = getNames("en");

export default function SelectNationality() {
  const [selectNationality, setSelectNationality] = useState(false);

  const { watch, setValue } = useFormContext<BookingSchema>();

  const nationality = watch("nationality");

  const handleOpenSelection = () => {
    setSelectNationality(true);
  };

  const handleCloseSelection = () => {
    setSelectNationality(false);
  };

  const handleSelectNationality = (n: string) => {
    setValue("nationality", n);
    handleCloseSelection();
  };

  return (
    <div className="relative border-2 border-secondary-normal/30 rounded-lg h-full text-primary-secondary">
      <button
        type="button"
        onClick={handleOpenSelection}
        className="w-full h-full flex justify-between items-center p-[0.5rem] overflow-hidden"
      >
        <span className="text-left ">{nationality}</span>
        <span className="text-lg">
          <IoMdArrowDropdown />
        </span>
      </button>

      <AnimatePresence>
        {selectNationality ? (
          <motion.div
            initial={{ opacity: 0, translateY: "-5%" }}
            animate={{ opacity: 1, translateY: "0%" }}
            exit={{ opacity: 0, translateY: "-5%" }}
            key="user-booking-select-nationalities"
            data-testid="user-booking-select-nationalities"
            className="absolute w-[100%] top-[100%] z-999"
          >
            <ClickOutside onClickOutside={handleCloseSelection}>
              <div className="h-[12.5rem] bg-white shadow-lg rounded-lg overflow-y-auto overflow-x-hidden">
                <ul>
                  {Object.keys(nationalities)
                    .map((n) => {
                      return nationalities[n];
                    })
                    .sort()
                    .map((n) => {
                      if (n === nationality) {
                        return (
                          <li key={n}>
                            <button
                              type="button"
                              onClick={() => handleSelectNationality(n)}
                              className="p-[0.5rem] text-left w-full bg-secondary-normal text-white"
                            >
                              <span className="font-bold">{n}</span>
                            </button>
                          </li>
                        );
                      }

                      return (
                        <li key={n}>
                          <button
                            type="button"
                            onClick={() => handleSelectNationality(n)}
                            className="p-[0.5rem] text-left w-full"
                          >
                            <span>{n}</span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </ClickOutside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

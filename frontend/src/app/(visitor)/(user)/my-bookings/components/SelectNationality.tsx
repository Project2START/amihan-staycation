"use client";

import { nationalities } from "@/app/shared/constants/nationalities";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiOutlineSelector } from "react-icons/hi";
import { BookingSchema } from "../schema/bookings.schema";

export default function SelectNationality() {
  const [nationality, setNationality] = useState("Filipino");
  const [openSelect, setOpenSelect] = useState(false);

  const { setValue } = useFormContext<BookingSchema>();

  const handleOpenSelect = () => {
    setOpenSelect(true);
  };
  const handleCloseSelect = () => {
    setOpenSelect(false);
  };
  return (
    <div className="h-full relative">
      <button
        type="button"
        onClick={handleOpenSelect}
        className="flex items-center justify-between border-b-2 border-secondary-normal/30 py-[0.5rem] relative w-full h-full input-base-focus"
      >
        <span>{nationality}</span>
        <span className="absolute right-0 text-lg">
          <HiOutlineSelector />
        </span>
      </button>

      <AnimatePresence>
        {openSelect ? (
          <motion.div
            initial={{ opacity: 0, translateY: "-1%" }}
            animate={{ opacity: 1, translateY: "0%" }}
            exit={{ opacity: 0, translateY: "-1%" }}
            key="user-booking-select-nationality"
            data-testid="user-booking-select-nationality"
            className="absolute w-[100%] top-[100%] z-999"
          >
            <ClickOutside onClickOutside={handleCloseSelect}>
              <div className="bg-white shadow-lg h-[12rem] overflow-y-auto overflow-x-hidden rounded-lg">
                <ul>
                  {nationalities.map((n) => {
                    if (n.nationality === nationality) {
                      return (
                        <li key={n.alpha_2_code}>
                          <button
                            type="button"
                            onClick={() => {
                              setNationality(n.nationality);
                              setValue("nationality", n.nationality);
                              handleCloseSelect();
                            }}
                            className="p-[0.5rem] truncate w-full text-left bg-secondary-normal input-base-focus"
                          >
                            <span className="font-bold text-white">
                              {n.nationality}
                            </span>
                          </button>
                        </li>
                      );
                    }
                    return (
                      <li key={n.alpha_2_code}>
                        <button
                          type="button"
                          onClick={() => {
                            setNationality(n.nationality);
                            setValue("nationality", n.nationality);
                            handleCloseSelect();
                          }}
                          className="p-[0.5rem] truncate w-full text-left hover:bg-secondary-normal/50 hover:text-white input-base-focus"
                        >
                          <span>{n.nationality}</span>
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

  {
  }
}

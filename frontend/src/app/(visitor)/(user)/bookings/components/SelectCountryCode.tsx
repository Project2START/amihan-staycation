"use client";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HiOutlineSelector } from "react-icons/hi";
import { BookingSchema } from "../schema/bookings.schema";
import ReactCountryFlag from "react-country-flag";

export default function SelectCountryCode({
  codes,
}: {
  codes: { countryCode: string; callingCode: string }[];
}) {
  const [code, setCode] = useState({ countryCode: "PH", callingCode: "+63" });
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
        className="rounded-tl-lg rounded-bl-lg flex items-center justify-between gap-x-1 border-2 border-secondary-normal/30 p-[0.25rem] relative w-[6.5rem] overflow-hidden h-full input-base-focus"
      >
        <ReactCountryFlag
          countryCode={code.countryCode}
          svg
          style={{ width: "1.5em", height: "1.5em" }}
        />
        <span className="text-sm font-bold">{code.callingCode}</span>
        <span className="text-lg">
          <HiOutlineSelector />
        </span>
      </button>

      <AnimatePresence>
        {openSelect ? (
          <motion.div
            initial={{ opacity: 0, translateY: "-1%" }}
            animate={{ opacity: 1, translateY: "0%" }}
            exit={{ opacity: 0, translateY: "-1%" }}
            key="user-booking-select-code"
            data-testid="user-booking-select-code"
            className="absolute w-[8.5rem] top-[100%] z-999"
          >
            <ClickOutside onClickOutside={handleCloseSelect}>
              <div className="bg-white shadow-lg h-[12rem] overflow-y-auto overflow-x-hidden rounded-lg">
                <ul>
                  {codes.map((c) => {
                    if (c.countryCode === code.countryCode) {
                      return (
                        <li key={c.countryCode}>
                          <button
                            type="button"
                            onClick={() => {
                              setCode({
                                callingCode: c.callingCode,
                                countryCode: c.countryCode,
                              });
                              handleCloseSelect();
                            }}
                            className=" text-white p-[0.5rem] truncate w-full text-left bg-secondary-normal input-base-focus"
                          >
                            <span>
                              <ReactCountryFlag
                                countryCode={c.countryCode}
                                svg
                                style={{ width: "1.5em", height: "1.5em" }}
                              />
                            </span>
                            <span className="font-bold ml-[0.5rem]">
                              {c.callingCode}
                            </span>
                          </button>
                        </li>
                      );
                    }
                    return (
                      <li key={c.countryCode}>
                        <button
                          type="button"
                          onClick={() => {
                            setCode({
                              callingCode: c.callingCode,
                              countryCode: c.countryCode,
                            });

                            setValue(
                              "contact_number.countryCode",
                              c.countryCode,
                            );
                            setValue(
                              "contact_number.callingCode",
                              c.callingCode,
                            );
                            handleCloseSelect();
                          }}
                          className="p-[0.5rem] truncate w-full text-left hover:bg-secondary-normal/50 hover:text-white input-base-focus"
                        >
                          <span>
                            <ReactCountryFlag
                              countryCode={c.countryCode}
                              svg
                              style={{ width: "1.5em", height: "1.5em" }}
                            />
                          </span>
                          <span className="ml-[0.5rem]">{c.callingCode} </span>
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

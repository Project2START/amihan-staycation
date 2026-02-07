import { nationalities } from "@/app/shared/constants/nationalities";
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
  const [code, setCode] = useState("PH");
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
        className="flex items-center justify-between border-2 border-secondary-normal/30 py-[0.5rem] relative w-full h-full input-base-focus"
      >
        <ReactCountryFlag
          countryCode={code}
          svg
          style={{ width: "1.5em", height: "1.5em" }}
        />
        <span>{codes.find((c) => c.countryCode === code)?.callingCode}</span>
      </button>

      <AnimatePresence>
        {openSelect ? (
          <motion.div
            initial={{ opacity: 0, translateY: "-1%" }}
            animate={{ opacity: 1, translateY: "0%" }}
            exit={{ opacity: 0, translateY: "-1%" }}
            key="user-booking-select-code"
            data-testid="user-booking-select-code"
            className="absolute w-[10rem] top-[100%] z-999"
          >
            <ClickOutside onClickOutside={handleCloseSelect}>
              <div className="bg-white shadow-lg h-[12rem] overflow-y-auto overflow-x-hidden rounded-lg">
                <ul>
                  {codes.map((c) => {
                    if (c.countryCode === code) {
                      return (
                        <li key={c.countryCode}>
                          <button
                            type="button"
                            onClick={() => {
                              setCode(c.countryCode);
                              handleCloseSelect();
                            }}
                            className="p-[0.5rem] truncate w-full text-left bg-secondary-normal input-base-focus"
                          >
                            <span>
                              <ReactCountryFlag
                                countryCode={c.countryCode}
                                svg
                                style={{ width: "1.5em", height: "1.5em" }}
                              />
                            </span>
                            <span className="font-bold text-white">
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
                            setCode(c.countryCode);
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
                          <span>{c.callingCode}</span>
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

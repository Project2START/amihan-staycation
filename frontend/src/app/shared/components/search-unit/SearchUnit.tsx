"use client";

import { useState } from "react";
import Calendar from "./Calendar";
import { LuCalendarDays } from "react-icons/lu";
import PrimaryButton from "../../ui/PrimaryButton";
import { AnimatePresence, motion } from "motion/react";
import ClickOutside from "../../ui/ClickOutside";
import { IoPersonSharp } from "react-icons/io5";
import Occupancy from "./Occupancy";
import dayjs from "dayjs";

export interface ISearchUnitState {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

export default function SearchUnit() {
  const [search, setSearch] = useState<ISearchUnitState>({
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
  });
  const [calendar, setCalendar] = useState(false);
  const [occupancy, setOccupancy] = useState(false);

  const handleSetSearch = (s: Partial<ISearchUnitState>) => {
    setSearch((search) => ({ ...search, ...s }));
  };

  const handleSetCalendar = (open: boolean) => {
    if (open) {
      setCalendar(true);
    } else {
      setCalendar(false);
    }
  };
  const handleSetOccupancy = (open: boolean) => {
    if (open) {
      setOccupancy(true);
    } else {
      setOccupancy(false);
    }
  };

  const dateCheckIn = dayjs(search.checkIn);
  const dateCheckOut = dayjs(search.checkOut);

  return (
    <div className="text-xs md:flex md:justify-center">
      <div className="border-2 border-primary-normal rounded-lg bg-white md:flex md:justify-between md:w-[80%] lg:w-[50%] ">
        <div className="relative">
          <button
            onClick={() => handleSetCalendar(true)}
            className="cursor-pointer border-b-2 border-primary-normal/50 w-full p-[1rem] hover-animation hover:opacity-50 disabled:opacity-50 md:border-0 md:border-r-2 md:border-gray-300"
            disabled={calendar}
          >
            <div className="relative flex items-center justify-center text-gray-500 ">
              <span className="absolute left-0 mr-[0.5rem] text-lg md:static">
                <LuCalendarDays />
              </span>
              <div>
                {search.checkIn === "" ? (
                  <span>Check-in date</span>
                ) : (
                  <span>
                    {dateCheckIn.format("ddd")}, {dateCheckIn.format("MMM")}{" "}
                    {dateCheckIn.format("DD")}
                  </span>
                )}
                <span className="mx-[0.5rem]">—</span>
                {search.checkOut === "" ? (
                  <span>Check-out date</span>
                ) : (
                  <span>
                    {dateCheckOut.format("ddd")}, {dateCheckOut.format("MMM")}{" "}
                    {dateCheckOut.format("DD")}
                  </span>
                )}
              </div>
            </div>
          </button>
          <div className="absolute top-[110%] w-[100%] z-99">
            <AnimatePresence initial={false}>
              {calendar ? (
                <motion.div
                  initial={{ opacity: 0, translateY: "-5%" }}
                  animate={{ opacity: 1, translateY: "0%" }}
                  exit={{ opacity: 0, translateY: "-5%" }}
                  key="search-calendar"
                >
                  <ClickOutside onClickOutside={() => handleSetCalendar(false)}>
                    <Calendar
                      search={search}
                      onSetSearch={handleSetSearch}
                      onSetCalendar={handleSetCalendar}
                    />
                  </ClickOutside>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="relative">
          <button
            disabled={occupancy}
            onClick={() => handleSetOccupancy(true)}
            className="w-full cursor-pointer p-[1rem] hover-animation hover:opacity-50 disabled:opacity-50"
          >
            <div className="relative flex items-center justify-center text-gray-500 ">
              <span className="absolute left-0 mr-[0.5rem] text-lg md:static">
                <IoPersonSharp />
              </span>
              <div>
                <ul role="list" className="list-disc flex gap-5 md:gap-4.5">
                  <li className="list-none">
                    <span>{search.adults}</span> Adults
                  </li>
                  <li>
                    <span>{search.children}</span> Children
                  </li>
                  <li>
                    <span>{search.rooms}</span> Room
                  </li>
                </ul>
              </div>
            </div>
          </button>
          <div className="absolute top-[110%] w-[100%] z-99">
            <AnimatePresence initial={false}>
              {occupancy ? (
                <motion.div
                  initial={{ opacity: 0, translateY: "-5%" }}
                  animate={{ opacity: 1, translateY: "0%" }}
                  exit={{ opacity: 0, translateY: "-5%" }}
                  key="search-calendar"
                >
                  <ClickOutside
                    onClickOutside={() => handleSetOccupancy(false)}
                  >
                    <Occupancy
                      search={search}
                      onSetSearch={handleSetSearch}
                      onSetOccupancy={handleSetOccupancy}
                    />
                  </ClickOutside>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        <div className="overflow-hidden">
          <PrimaryButton style={{ borderRadius: "5px", height: "100%" }}>
            <span className="text-xs font-bold px-[0.5rem] hover-animation hover:opacity-50">
              Search
            </span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

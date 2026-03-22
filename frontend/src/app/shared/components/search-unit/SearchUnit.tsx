"use client";

import { useEffect, useMemo, useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import ClickOutside from "../../ui/ClickOutside";
import { IoPersonSharp } from "react-icons/io5";
import Occupancy from "./Occupancy";
import dayjs from "dayjs";
import CalendarBooking from "../CalendarBooking";
import { DatesRangeValue } from "@mantine/dates";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface ISearchUnitState {
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
}

const DEFAULT_SEARCH_STATE: ISearchUnitState = {
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
};

const parsePositiveInteger = (
  value: string | null,
  fallback: number,
  min = 0,
) => {
  if (!value) return fallback;

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return Math.max(min, Math.floor(parsed));
};

const getSearchFromParams = (
  params: URLSearchParams,
  fallback: ISearchUnitState,
): ISearchUnitState => {
  return {
    checkIn: params.get("checkIn") ?? fallback.checkIn,
    checkOut: params.get("checkOut") ?? fallback.checkOut,
    adults: parsePositiveInteger(params.get("adults"), fallback.adults, 1),
    children: parsePositiveInteger(
      params.get("children"),
      fallback.children,
      0,
    ),
  };
};

const buildSearchParams = (search: ISearchUnitState) => {
  const params = new URLSearchParams();

  if (search.checkIn) params.set("checkIn", search.checkIn);
  if (search.checkOut) params.set("checkOut", search.checkOut);
  if (search.adults > 0) params.set("adults", String(search.adults));
  if (search.children > 0) params.set("children", String(search.children));

  return params;
};

export default function SearchUnit() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<ISearchUnitState>(DEFAULT_SEARCH_STATE);
  const [calendar, setCalendar] = useState(false);
  const [occupancy, setOccupancy] = useState(false);

  const paramsString = searchParams.toString();

  const paramsBasedSearch = useMemo(() => {
    const params = new URLSearchParams(paramsString);
    return getSearchFromParams(params, DEFAULT_SEARCH_STATE);
  }, [paramsString]);

  useEffect(() => {
    setSearch(paramsBasedSearch);
  }, [paramsBasedSearch]);

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

  const onSearch = () => {
    const params = buildSearchParams(search);
    params.set("searched", "1");

    const targetPath = "/units";
    const nextUrl = `${targetPath}?${params.toString()}`;

    if (pathname !== targetPath) {
      const currentParams = buildSearchParams(search);
      const landingUrl = currentParams.toString()
        ? `${pathname}?${currentParams.toString()}`
        : pathname;

      router.replace(landingUrl);
    }

    router.push(nextUrl);
  };

  const onResetDates = () => {
    setSearch((prev) => ({
      ...prev,
      checkIn: null,
      checkOut: null,
    }));
    setCalendar(false);
  };

  return (
    <div className="text-xs md:flex md:justify-center lg:text-base">
      <div className="border-2 border-primary-normal rounded-lg bg-white md:flex md:justify-between md:w-[80%] lg:w-[55%] ">
        <div className="relative min-w-0 md:basis-[45%]">
          <button
            onClick={() => handleSetCalendar(true)}
            className="border-b-2 border-primary-normal/50 w-full p-[1rem] hover-animation hover:opacity-50 md:border-0 md:border-r-2 md:border-gray-300 lg:p-[1.5rem]"
            disabled={calendar}
            aria-label="date-range-button"
          >
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span className="shrink-0 text-lg lg:text-2xl">
                <LuCalendarDays />
              </span>
              <div className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {!search.checkIn ? (
                  <span>Check-in date</span>
                ) : (
                  <span>
                    {dateCheckIn.format("ddd")}, {dateCheckIn.format("MMM")}{" "}
                    {dateCheckIn.format("DD")}
                  </span>
                )}
                <span className="mx-[0.5rem]">—</span>
                {!search.checkOut ? (
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
                  data-testid="search-calendar"
                  className="relative"
                >
                  <ClickOutside onClickOutside={() => handleSetCalendar(false)}>
                    <CalendarBooking
                      hasPresets={true}
                      defaultValue={[search.checkIn, search.checkOut]}
                      onCalendarChange={(value: DatesRangeValue<string>) => {
                        setSearch((search) => ({
                          ...search,
                          checkIn: value[0],
                          checkOut: value[1],
                        }));

                        if (value[0] && value[1]) {
                          handleSetCalendar(false);
                        }
                      }}
                    />
                    <div className="hidden mt-[0.75rem] absolute top-2 right-2 text-xs lg:block lg:text-sm">
                      <button
                        type="button"
                        onClick={onResetDates}
                        className="underline font-semibold text-secondary-normal hover:opacity-70 "
                      >
                        Reset
                      </button>
                    </div>
                  </ClickOutside>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative min-w-0 md:basis-[35%]">
          <button
            disabled={occupancy}
            onClick={() => handleSetOccupancy(true)}
            className="w-full p-[1rem] hover-animation hover:opacity-50 lg:p-[1.5rem]"
            aria-label="occupancy-button"
          >
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <span className="shrink-0 text-lg lg:text-2xl">
                <IoPersonSharp />
              </span>
              <div className="min-w-0 overflow-hidden whitespace-nowrap">
                <ul
                  role="list"
                  className="list-disc flex flex-nowrap gap-6 whitespace-nowrap sm:gap-4 md:gap-5 lg:gap-8.5"
                >
                  <li className="list-none">
                    <span>{search.adults}</span> Adults
                  </li>
                  <li>
                    <span>{search.children}</span> Children
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
                  key="search-occupancy"
                  data-testid="search-occupancy"
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
        <div className="md:basis-1/5 md:min-w-[6.25rem] md:shrink-0">
          <button
            type="button"
            onClick={onSearch}
            className="w-full whitespace-nowrap primary-button-link hover-animation rounded-[5px] h-[100%] px-4 lg:px-[1.5rem] lg:text-base lg:hover:bg-primary-normal/80"
          >
            <span className="font-bold">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

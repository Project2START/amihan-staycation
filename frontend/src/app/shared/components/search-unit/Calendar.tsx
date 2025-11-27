"use client";

import React, { useEffect, useReducer, useState } from "react";
import { MONTHS, WEEKS_SHORT } from "../../constants/dates";
import { getFirstDDay } from "../../lib/getFirstDDay";
import { getMonthTotalDays } from "../../lib/getMonthTotalDays";
import { GrFormNext } from "react-icons/gr";
import { GrFormPrevious } from "react-icons/gr";
import { isToday } from "../../lib/isToday";
import { isDatePast } from "../../lib/isDatePast";
import { isDateInRange } from "../../lib/isDateInRange";
import { ISearchUnitState } from "./SearchUnit";
import PrimaryButton from "../../ui/PrimaryButton";

const CURRENT_DATE = new Date();

const MONTH = CURRENT_DATE.getMonth();
const YEAR = CURRENT_DATE.getFullYear();
const FIRST_DDAY = getFirstDDay();

interface ICalendarProps {
  search: ISearchUnitState;
  onSetSearch: (s: Partial<ISearchUnitState>) => void;
  onSetCalendar: (open: boolean) => void;
}

interface IReducerState {
  month: number;
  year: number;
  firstDDay: number;
}

interface IDateState {
  date: string;
}

interface IRangeState {
  checkIn: string;
  checkOut: string;
}

type CalendarAction = { type: "NEXT_MONTH" } | { type: "PREV_MONTH" };

export default function Calendar({
  search,
  onSetSearch,
  onSetCalendar,
}: ICalendarProps) {
  const [dates, setDates] = useState<IDateState[]>([]);
  const [range, setRange] = useState<IRangeState>({
    checkIn: "",
    checkOut: "",
  });
  const [state, dispatch] = useReducer(reducer, {
    month: MONTH,
    year: YEAR,
    firstDDay: FIRST_DDAY,
  });

  const handleClickDate = (newDate: string) => {
    if (!range.checkIn) {
      setRange((range) => ({ ...range, checkIn: newDate }));
      return;
    }
    if (!range.checkOut && newDate > range.checkIn) {
      setRange((range) => ({ ...range, checkOut: newDate }));
      return;
    }
    setRange((range) => ({ ...range, checkIn: newDate, checkOut: "" }));
  };

  useEffect(() => {
    const totalDays = getMonthTotalDays(state.year, state.month);
    const newDates = Array.from({ length: totalDays }, (_, index) => ({
      date: new Date(state.year, state.month, index + 1).toISOString(),
    }));

    setDates(newDates);
  }, [state.year, state.month]);

  useEffect(() => {
    setRange({ checkIn: search.checkIn, checkOut: search.checkOut });
  }, [search.checkIn, search.checkOut]);

  return (
    <div className="p-[1rem] text-xs bg-white shadow-xl/10 rounded-xl relative">
      <div className="flex justify-center pb-[1rem]">
        <div className="w-[75%] flex justify-between items-center">
          <button
            onClick={() => {
              dispatch({ type: "PREV_MONTH" });
            }}
          >
            <span className="text-2xl text-secondary-normal">
              <GrFormPrevious />
            </span>
          </button>
          <span className="font-bold">
            {MONTHS[state.month]} {state.year}
          </span>
          <button
            onClick={() => {
              dispatch({ type: "NEXT_MONTH" });
            }}
          >
            <span className="text-2xl text-secondary-normal">
              <GrFormNext />
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center">
        {WEEKS_SHORT.map((week) => {
          return (
            <div key={week} className="p-[0.5rem]">
              {week}
            </div>
          );
        })}
        {dates.map((date, index) => {
          const NEW_DATE = new Date(date.date);

          const today = isToday(NEW_DATE);
          const past = isDatePast(NEW_DATE);
          const within = isDateInRange(
            range.checkIn,
            range.checkOut,
            NEW_DATE.toISOString()
          );
          const selected =
            range.checkIn === NEW_DATE.toISOString() ||
            range.checkOut === NEW_DATE.toISOString();
          const firstDDay = index === 0;

          let style;

          if (selected) {
            style = "bg-secondary-normal text-white";
          }

          if (today) {
            style = "font-bold text-primary-normal";
          }

          if (within) {
            style = "bg-gray-300";
          }
          if (today && selected) {
            style = "font-bold text-white bg-secondary-normal";
          }

          return (
            <button
              key={date.date}
              className={`p-[0.5rem] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${style}`}
              disabled={past}
              onClick={() => handleClickDate(date.date)}
              style={{
                gridColumnStart: firstDDay ? state.firstDDay + 1 : "auto",
              }}
            >
              {NEW_DATE.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-[1rem]">
        <PrimaryButton
          disabled={range.checkIn === "" || range.checkOut === ""}
          onClick={() => {
            onSetSearch({ checkIn: range.checkIn, checkOut: range.checkOut });
            onSetCalendar(false);
          }}
        >
          <span className="text-xs">Done</span>
        </PrimaryButton>
      </div>
    </div>
  );
}

const reducer: React.Reducer<IReducerState, CalendarAction> = (
  state,
  action
) => {
  const date = new Date(state.year, state.month, 1);

  switch (action.type) {
    case "NEXT_MONTH": {
      date.setMonth(state.month + 1);
      return {
        firstDDay: date.getDay(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    }
    case "PREV_MONTH": {
      date.setMonth(state.month - 1);

      return {
        firstDDay: date.getDay(),
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    }
    default: {
      return state;
    }
  }
};

"use client";

import { DatePicker, DatesRangeValue } from "@mantine/dates";
import { useEffect, useState } from "react";
import classes from "@/app/shared/cssModules/Calendar.module.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getDateOffsetFromToday } from "../lib/getDateOffSetFromToday";

dayjs.extend(utc);
dayjs.extend(timezone);

interface ICalendarProps {
  onCalendarChange: (value: DatesRangeValue<string>) => void;
  disabledDates?: Date[];
  defaultValue: [string | null, string | null];
  hasPresets: boolean;
  readOnly?: boolean;
}

export default function CalendarBooking({
  onCalendarChange,
  disabledDates,
  defaultValue,
  hasPresets,
  readOnly = false,
}: ICalendarProps) {
  const [calendarValue, setCalendarValue] = useState<
    [string | null, string | null]
  >([null, null]);

  // Use PH timezone for presets
  const phToday = dayjs().tz("Asia/Manila").startOf("day");

  useEffect(() => {
    setCalendarValue(defaultValue);
  }, [defaultValue]);

  const isDisabledDate = (date: string | Date) => {
    if (!disabledDates?.length) return false;

    const target = dayjs(date).startOf("day");

    return disabledDates.some((d) => target.isSame(dayjs(d).startOf("day")));
  };

  const isDateInActiveRange = (date: string | Date) => {
    if (!calendarValue[0] || !calendarValue[1]) return false;

    const target = dayjs(date).startOf("day");
    const rangeStart = dayjs(calendarValue[0]).startOf("day");
    const rangeEnd = dayjs(calendarValue[1]).startOf("day");

    return (
      (target.isAfter(rangeStart) && target.isBefore(rangeEnd)) ||
      target.isSame(rangeStart) ||
      target.isSame(rangeEnd)
    );
  };

  const hasBlockedDateInRangeMiddle = (
    startDate: string,
    endDate: string,
    blockedDates: Date[],
  ) => {
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).startOf("day");

    return blockedDates.some((blockedDate) => {
      const blocked = dayjs(blockedDate).startOf("day");

      // Block only dates inside the range middle.
      // End boundary can still be allowed by checkout-specific rules.
      return blocked.isAfter(start) && blocked.isBefore(end);
    });
  };

  return (
    <div className="bg-white p-[1.5rem] rounded-lg overflow-hidden min-w-0 flex justify-center shadow-xl/30">
      <div className="w-max">
        <DatePicker
          classNames={{
            day: classes.day,
            datePickerRoot: classes.datePickerRoot,
            presetsList: hasPresets ? classes.presetsList : undefined,
            levelsGroup: classes.levelsGroup,
            presetButton: classes.presetButton,
          }}
          type="range"
          value={calendarValue}
          onChange={(value) => {
            if (readOnly) return;

            const isSelectingRangeEnd = Boolean(
              calendarValue[0] && !calendarValue[1],
            );

            // Keep disabled dates blocked as check-in starts.
            if (value[0] && !value[1] && isDisabledDate(value[0])) {
              return;
            }

            if (
              isSelectingRangeEnd &&
              calendarValue[0] &&
              value[0] &&
              value[1]
            ) {
              const expectedCheckIn = dayjs(calendarValue[0]).startOf("day");
              const actualRangeStart = dayjs(value[0]).startOf("day");

              // Prevent reversed picks from being reinterpreted as a new check-in.
              if (!actualRangeStart.isSame(expectedCheckIn)) {
                const adjustedValue: DatesRangeValue<string> = [
                  calendarValue[0],
                  null,
                ];
                setCalendarValue(adjustedValue);
                onCalendarChange(adjustedValue);
                return;
              }
            }

            if (value[0] && value[1] && disabledDates?.length) {
              const start = dayjs(value[0]).startOf("day");
              const end = dayjs(value[1]).startOf("day");
              const isForwardRange = end.isAfter(start);
              const isBlockedEndBoundary = isDisabledDate(value[1]);
              const hasBlockedMiddle = hasBlockedDateInRangeMiddle(
                value[0],
                value[1],
                disabledDates,
              );

              if (
                hasBlockedMiddle &&
                !(isForwardRange && isBlockedEndBoundary)
              ) {
                const adjustedValue: DatesRangeValue<string> = [value[0], null];
                setCalendarValue(adjustedValue);
                onCalendarChange(adjustedValue);
                return;
              }
            }

            setCalendarValue(value);
            onCalendarChange(value);
          }}
          minDate={phToday.toDate()}
          maxDate={getDateOffsetFromToday(6, "months", "Asia/Manila")}
          presets={
            hasPresets
              ? [
                  {
                    value: [
                      phToday.format("YYYY-MM-DD"),
                      phToday.add(1, "day").format("YYYY-MM-DD"),
                    ],
                    label: "1-night stay",
                  },
                  {
                    value: [
                      phToday.format("YYYY-MM-DD"),
                      phToday.add(3, "day").format("YYYY-MM-DD"),
                    ],
                    label: "3-night stay",
                  },
                  {
                    value: [
                      phToday.format("YYYY-MM-DD"),
                      phToday.add(1, "week").format("YYYY-MM-DD"),
                    ],
                    label: "1-week stay",
                  },
                  {
                    value: [
                      phToday.format("YYYY-MM-DD"),
                      phToday.add(1, "month").format("YYYY-MM-DD"),
                    ],
                    label: "1-month stay",
                  },
                ]
              : []
          }
          excludeDate={
            disabledDates
              ? (date) => {
                  if (!isDisabledDate(date)) {
                    return false;
                  }

                  // Allow disabled dates as checkout only for forward picks.
                  const isSelectingRangeEnd = Boolean(
                    calendarValue[0] && !calendarValue[1],
                  );

                  if (isSelectingRangeEnd && calendarValue[0]) {
                    const selectedCheckIn = dayjs(calendarValue[0]).startOf(
                      "day",
                    );
                    const candidateCheckOut = dayjs(date).startOf("day");

                    if (candidateCheckOut.isAfter(selectedCheckIn)) {
                      return false;
                    }
                  }

                  // Keep disabled dates renderable when they belong to the active range.
                  if (isDateInActiveRange(date)) {
                    return false;
                  }

                  return true;
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

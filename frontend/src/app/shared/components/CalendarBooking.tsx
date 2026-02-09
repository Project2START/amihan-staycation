"use client";

import { DatePicker, DatesRangeValue } from "@mantine/dates";
import { useState } from "react";
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
}

export default function CalendarBooking({
  onCalendarChange,
  disabledDates,
}: ICalendarProps) {
  const [calendarValue, setCalendarValue] = useState<
    [string | null, string | null]
  >([null, null]);

  // Use PH timezone for presets
  const phToday = dayjs().tz("Asia/Manila").startOf("day");

  return (
    <div className="bg-white p-[1.5rem] rounded-lg overflow-hidden min-w-0 flex justify-center shadow-xl/30">
      <div className="w-max">
        <DatePicker
          classNames={{
            day: classes.day,
            datePickerRoot: classes.datePickerRoot,
            presetsList: classes.presetsList,
            levelsGroup: classes.levelsGroup,
            presetButton: classes.presetButton,
          }}
          type="range"
          value={calendarValue}
          onChange={(value) => {
            setCalendarValue(value);
            onCalendarChange(value);
          }}
          minDate={phToday.toDate()}
          maxDate={getDateOffsetFromToday(6, "months", "Asia/Manila")}
          presets={[
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
          ]}
          excludeDate={
            disabledDates
              ? (date) => {
                  const parsedDate = new Date(date);
                  return disabledDates.some(
                    (d) =>
                      d.getFullYear() === parsedDate.getFullYear() &&
                      d.getMonth() === parsedDate.getMonth() &&
                      d.getDate() === parsedDate.getDate(),
                  );
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}

// "use client";

// import { DatePicker, DatesRangeValue } from "@mantine/dates";
// import { useState } from "react";
// import classes from "@/app/shared/cssModules/Calendar.module.css";
// import dayjs from "dayjs";
// import { getDateOffsetFromToday } from "../lib/getDateOffSetFromToday";

// interface ICalendarProps {
//   onCalendarChange: (value: DatesRangeValue<string>) => void;
//   disabledDates?: Date[];
// }
// export default function CalendarBooking({
//   onCalendarChange,
//   disabledDates,
// }: ICalendarProps) {
//   const [calendarValue, setCalendarValue] = useState<
//     [string | null, string | null]
//   >([null, null]);

//   const today = dayjs();
//   return (
//     <div className="bg-white p-[1.5rem] rounded-lg overflow-hidden min-w-0 flex justify-center shadow-xl/30">
//       <div className="w-max">
//         <DatePicker
//           classNames={{
//             day: classes.day,
//             datePickerRoot: classes.datePickerRoot,
//             presetsList: classes.presetsList,
//             levelsGroup: classes.levelsGroup,
//             presetButton: classes.presetButton,
//           }}
//           type="range"
//           value={calendarValue}
//           onChange={(value) => {
//             setCalendarValue(value);
//             onCalendarChange(value);
//           }}
//           minDate={new Date()}
//           maxDate={getDateOffsetFromToday(6, "months")}
//           presets={[
//             {
//               value: [
//                 today.format("YYYY-MM-DD"),
//                 today.add(1, "day").format("YYYY-MM-DD"),
//               ],
//               label: "1-night stay",
//             },
//             {
//               value: [
//                 today.format("YYYY-MM-DD"),
//                 today.add(3, "day").format("YYYY-MM-DD"),
//               ],
//               label: "3-night stay",
//             },
//             {
//               value: [
//                 today.format("YYYY-MM-DD"),
//                 today.add(1, "week").format("YYYY-MM-DD"),
//               ],
//               label: "1-week stay",
//             },
//             {
//               value: [
//                 today.format("YYYY-MM-DD"),
//                 today.add(1, "month").format("YYYY-MM-DD"),
//               ],
//               label: "1-month stay",
//             },
//           ]}
//           excludeDate={
//             disabledDates
//               ? (date) => {
//                   const parsedDate = new Date(date);

//                   return disabledDates.some(
//                     (d) =>
//                       d.getFullYear() === parsedDate.getFullYear() &&
//                       d.getMonth() === parsedDate.getMonth() &&
//                       d.getDate() === parsedDate.getDate(),
//                   );
//                 }
//               : undefined
//           }
//         />
//       </div>
//     </div>
//   );
// }

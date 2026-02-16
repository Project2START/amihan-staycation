import dayjs from "dayjs";
import { getDateList } from "./getDateList";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { endTime, startTime } from "../constants/standardStayTime";

dayjs.extend(customParseFormat);

export function getPoolAccessDates(
  startDate: string,
  endDate: string,
): { date: string; am: boolean | null; pm: boolean | null }[] | string {
  const dateList = getDateList(startDate, endDate);

  if (typeof dateList === "string") {
    return dateList;
  }

  return dateList.map((date, index) => {
    if (index === 0) {
      const time = dayjs(startTime, "HH:mm");
      const hour = Number(time.format("h"));

      return hour >= 12
        ? { date, am: false, pm: false }
        : { date, am: null, pm: false };
    }

    if (index === dateList.length - 1) {
      const time = dayjs(endTime, "HH:mm");
      const hour = Number(time.format("h"));

      return hour >= 12
        ? { date, am: false, pm: null }
        : { date, am: false, pm: false };
    }

    return { date, am: false, pm: false };
  });
}

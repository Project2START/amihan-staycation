import cron from "node-cron";
import { bookingService } from "../modules/booking/services/booking.service";

const CRON_EXPRESSIONS = ["0,5,10 12 * * *", "0,5,10 14 * * *"];

const runStatusTransitions = async (label: string) => {
  try {
    const result = await bookingService.runAutomatedStatusTransitions();

    console.log(
      `[booking-status-cron:${label}] processed=${result.totalProcessed}, expired=${result.expired}, checked_in=${result.checkedIn}, checked_out=${result.checkedOut}`,
    );
  } catch (error) {
    console.error(`[booking-status-cron:${label}] failed`, error);
  }
};

export const startBookingStatusCron = () => {
  for (const expression of CRON_EXPRESSIONS) {
    cron.schedule(
      expression,
      () => {
        void runStatusTransitions(expression);
      },
      {
        timezone: "Asia/Manila",
      },
    );
  }

  console.log(
    "[booking-status-cron] scheduled at 12:00/12:05/12:10 and 14:00/14:05/14:10 (Asia/Manila)",
  );
};

"use client";

import { useAppSelector } from "@/lib/hooks";
import AvailabilityCalendarButton from "@/app/shared/components/AvailabilityCalendarButton";

export default function UserAvailabilityCalendar() {
  const user = useAppSelector((state) => state.users);

  if (user.data?.role !== "agent") return null;

  return <AvailabilityCalendarButton bottomClassName="bottom-6" />;
}

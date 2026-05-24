"use client";

import { useAppSelector } from "@/lib/hooks";
import AvailabilityCalendarButton from "@/app/shared/components/AvailabilityCalendarButton";
import { usePathname } from "next/navigation";

const EXCLUDED_PATHS = ["/bookings"];

export default function UserAvailabilityCalendar() {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));

  if (isExcluded) return null;

  const user = useAppSelector((state) => state.users);

  if (user.data?.role !== "agent") return null;

  return <AvailabilityCalendarButton bottomClassName="bottom-6" />;
}

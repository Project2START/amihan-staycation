"use client";

import { usePathname } from "next/navigation";
import AvailabilityCalendarButton from "@/app/shared/components/AvailabilityCalendarButton";

const EXCLUDED_PATHS = ["/payment-methods"];

export default function AdminAvailabilityCalendar() {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));

  if (isExcluded) return null;

  return <AvailabilityCalendarButton />;
}

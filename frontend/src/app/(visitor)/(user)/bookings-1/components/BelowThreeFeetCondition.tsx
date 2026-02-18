"use client";

import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";

export default function BelowThreeFeetCondition({
  children,
  fieldName,
}: {
  children: React.ReactNode;
  fieldName: any;
}) {
  const { watch } = useFormContext<BookingSchema>();

  const below_three_feet = watch(fieldName);

  if (below_three_feet) return null;

  return <>{children}</>;
}

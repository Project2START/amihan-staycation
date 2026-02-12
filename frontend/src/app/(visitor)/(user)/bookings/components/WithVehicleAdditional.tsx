"use client";

import { Switch } from "@mantine/core";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";

export default function WithVehicle({ index }: { index: number }) {
  const { setValue, watch } = useFormContext<BookingSchema>();

  const withVehicle = watch(`additional_guests.${index}.with_vehicle`);
  const below_three_feet = watch(`additional_guests.${index}.below_three_feet`);

  if (below_three_feet) return null;
  return (
    <div className="text-xs text-secondary-normal">
      <div className="flex items-center justify-between">
        <p className="font-bold">With Vehicle</p>
        <Switch
          defaultChecked
          checked={withVehicle}
          onChange={(event) => {
            // setWithVehicle(event.currentTarget.checked);
            setValue(
              `additional_guests.${index}.with_vehicle`,
              event.currentTarget.checked,
            );
          }}
          color="var(--color-primary-normal)"
          withThumbIndicator={false}
        />
      </div>

      {withVehicle && (
        <p className="py-[1rem]">
          <strong className="mr-[0.25rem]">Note:</strong>
          <i>
            Note: Additional parking fees apply — ₱250.00 for motorcycles and
            ₱350.00 for cars.
          </i>
        </p>
      )}
    </div>
  );
}

"use client";

import { Switch } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";

export default function WithVehicle({ name }: { name: any }) {
  const { setValue, watch } = useFormContext<BookingSchema>();

  const withVehicle = watch(name);

  return (
    <div className="text-xs text-secondary-normal">
      <div className="flex items-center justify-between">
        <p className="font-bold">With Vehicle</p>
        <Switch
          defaultChecked
          checked={withVehicle}
          onChange={(event) => {
            setValue(name, event.currentTarget.checked);
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

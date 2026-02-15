"use client";

import { Switch } from "@mantine/core";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";

export default function ThreeFeetAdditional({ index }: { index: number }) {
  const { setValue, watch } = useFormContext<BookingSchema>();

  const isThreeFeet = watch(`additional_guests.${index}.below_three_feet`);

  return (
    <div className="text-xs text-secondary-normal">
      <div className="flex items-center justify-between">
        <p className="font-bold">Below Three Feet</p>
        <Switch
          defaultChecked
          checked={isThreeFeet}
          onChange={(event) => {
            setValue(
              `additional_guests.${index}.below_three_feet`,
              event.currentTarget.checked,
            );
            setValue(`additional_guests.${index}.with_vehicle`, false);
            setValue(`additional_guests.${index}.valid_id`, undefined);
            setValue(
              `additional_guests.${index}.pool_access.access`,
              undefined,
            );
          }}
          color="var(--color-primary-normal)"
          withThumbIndicator={false}
        />
      </div>

      {!isThreeFeet && (
        <p className="py-[0.5rem]">
          <strong className="mr-[0.25rem]">Note:</strong>
          <i>Children three feet and below receive free pool access.</i>
        </p>
      )}
    </div>
  );
}

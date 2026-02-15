"use client";

import { Switch } from "@mantine/core";
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";

export default function BelowThreeFeet({
  field,
  index,
}: {
  field: FieldArrayWithId<BookingSchema, "additional_guests", "id">;
  index: number;
}) {
  const { watch, setValue, control, getValues } =
    useFormContext<BookingSchema>();

  const { update } = useFieldArray({ name: "additional_guests", control });

  const belowThreeFeet = watch(`additional_guests.${index}.below_three_feet`);

  return (
    <div className="text-xs text-secondary-normal">
      <div className="flex items-center justify-between sticky top-0 left-0 bg-white z-99 py-[0.5rem]">
        <p className="font-bold">Below Three Feet</p>
        <Switch
          defaultChecked
          checked={belowThreeFeet}
          onChange={(event) => {
            const currentAdditionalGuest = getValues(
              `additional_guests.${index}`,
            );

            if (event.currentTarget.checked) {
              update(index, {
                ...currentAdditionalGuest,
                valid_id: undefined,
                with_vehicle: false,
                pool_access: { hasAccess: false, access: [] },
                below_three_feet: event.currentTarget.checked,
              });
            } else {
              update(index, {
                ...currentAdditionalGuest,
                below_three_feet: event.currentTarget.checked,
              });
            }
            // setValue(fieldName, event.currentTarget.checked);
            // setValue(`additional_guests.${index}.valid_id`, undefined);
            // setValue(`additional_guests.${index}.with_vehicle`, false);
            // setValue(
            //   `additional_guests.${index}.pool_access.access`,
            //   undefined,
            // );
          }}
          color="var(--color-primary-normal)"
          withThumbIndicator={false}
        />
      </div>
    </div>
  );
}

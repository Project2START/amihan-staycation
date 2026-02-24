"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import UploadFilePhoto from "./UploadFilePhoto";
import { BookingSchema } from "../schema/bookings.schema";
import { useEffect } from "react";

interface UploadFileParentAdditionalProps {
  index: number;
}
export default function UploadFileParentAdditional({
  index,
}: UploadFileParentAdditionalProps) {
  const {
    formState: { errors },
    watch,
    setFocus,
    clearErrors,
    getValues,
    control,
  } = useFormContext<BookingSchema>();

  const { update } = useFieldArray({
    name: "additional_guests",
    control,
  });

  const valid_id_file = watch(`additional_guests.${index}.valid_id`);

  useEffect(() => {
    if (errors.additional_guests?.[index]?.valid_id) {
      setFocus(`additional_guests.${index}.valid_id`);
    }
  }, [setFocus, errors.additional_guests?.[index]?.valid_id]);

  return (
    <div>
      <UploadFilePhoto
        uploadTextContent="Valid ID"
        url={valid_id_file?.url}
        onSelectPhoto={(photoFile) => {
          const currentAdditionalGuest = getValues(
            `additional_guests.${index}`,
          );
          update(index, { ...currentAdditionalGuest, valid_id: photoFile });
          clearErrors(`additional_guests.${index}.valid_id`);
        }}
        onDeletePhoto={() => {
          const currentAdditionalGuest = getValues(
            `additional_guests.${index}`,
          );
          update(index, {
            ...currentAdditionalGuest,
            valid_id: undefined,
          });
        }}
        fieldName={`additional_guests.${index}.valid_id`}
      />
      {errors.additional_guests?.[index]?.valid_id && (
        <p className="text-red-900 text-[0.65rem]" id="guestValidId-error">
          Valid ID is required
        </p>
      )}
    </div>
  );
}

import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import UploadFilePhoto from "./UploadFilePhoto";

export default function UploadPhotoAdditional({ index }: { index: number }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BookingSchema>();
  const valid_id_file = watch(`additional_guests.${index}.valid_id`);
  const below_three_feet = watch(`additional_guests.${index}.below_three_feet`);

  if (below_three_feet) return null;
  return (
    <div>
      <UploadFilePhoto
        uploadTextContent="Valid ID"
        url={valid_id_file?.url}
        onSelectPhoto={(photoFile) => {
          setValue(`additional_guests.${index}.valid_id`, photoFile);
        }}
        onDeletePhoto={() => {
          setValue(`additional_guests.${index}.valid_id`, {
            file: undefined,
            id: "",
            url: "",
          });
        }}
      />
      {errors?.additional_guests?.[index]?.valid_id && (
        <p className="text-red-900 text-[0.65rem]">Valid ID is required</p>
      )}
    </div>
  );
}

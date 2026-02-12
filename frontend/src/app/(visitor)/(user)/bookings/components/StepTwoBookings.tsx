"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  BookingAdditionalGuestsSchema,
  BookingSchema,
} from "../schema/bookings.schema";
import PoolAccessAdditional from "./PoolAccessAdditional";
import WithVehicleAdditional from "./WithVehicleAdditional";
import UploadPhotoAdditional from "./UploadPhotoAdditional";
import ThreeFeetAdditional from "./ThreeFeetAdditional";
import { IoIosCloseCircle } from "react-icons/io";

const newGuest: BookingAdditionalGuestsSchema = {
  name: "",
  below_three_feet: false,
  with_vehicle: false,
  age: undefined,
  valid_id: { id: "", url: "", file: undefined },
  pool_access: [],
};

export default function StepTwoBookings() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BookingSchema>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: "additional_guests",
  });

  return (
    <div>
      <div>
        <h2 className="text-center font-normal mb-[1rem]">Additional Guests</h2>
      </div>

      <div className="flex flex-col gap-y-10">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="border-2 border-secondary-normal/30 rounded-lg p-[1rem] relative"
            >
              <button
                type="button"
                onClick={() => {
                  remove(index);
                }}
              >
                <span className="w-max h-max text-2xl absolute text-reject-normal top-0 right-0 translate-y-[-50%] translate-x-[50%] bg-white rounded-full ">
                  <IoIosCloseCircle />
                </span>
              </button>
              <div className="flex flex-col gap-y-5">
                {/* ADDITIONAL GUEST NAME FIELD */}
                <div className="h-[2.5rem]">
                  <input
                    {...register(`additional_guests.${index}.name`)}
                    type="text"
                    placeholder="Name"
                    aria-describedby={
                      errors.name ? `guest${index}Name-error` : undefined
                    }
                    className="w-full h-full border-b-2 border-secondary-normal/30 p-[0.5rem] input-base-focus"
                  />
                  {errors.additional_guests?.[index]?.name?.message && (
                    <p
                      className="text-red-900 text-[0.65rem]"
                      id={`guest${index}Name-error`}
                    >
                      {errors.additional_guests[index]?.name?.message}
                    </p>
                  )}
                </div>
                {/* ADDITIONAL GUEST AGE FIELD */}
                <div className="h-[2.5rem]">
                  <input
                    {...register(`additional_guests.${index}.age`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="Age"
                    aria-describedby={
                      errors.age ? `guest${index}Age-error` : undefined
                    }
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full h-full border-b-2 border-secondary-normal/30 p-[0.5rem] input-base-focus"
                  />
                  {errors.additional_guests?.[index]?.age?.message && (
                    <p
                      className="text-red-900 text-[0.65rem]"
                      id={`guest${index}Age-error`}
                    >
                      {errors.additional_guests[index]?.age?.message}
                    </p>
                  )}
                </div>
                {/* ADDITIONAL GUEST BELOW THREE FEET */}
                <div>
                  <ThreeFeetAdditional index={index} />
                </div>
                {/* ADDITIONAL GUEST VALID PHOTO ID */}
                <UploadPhotoAdditional index={index} />
                {/* ADDITIONAL GUEST POOL ACCESS */}
                <PoolAccessAdditional index={index} />
                {/* ADDITIONAL GUEST WITH VEHICLE */}
                <WithVehicleAdditional index={index} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            append(newGuest);
          }}
          className="px-[2.5rem] py-[0.5rem] mt-[1rem] border-2 border-secondary-normal/30 rounded-lg"
        >
          Add Guest
        </button>
      </div>
    </div>
  );
}

"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import UploadFileParentAdditional from "./UploadFileParentAdditional";
import PoolAccess from "./PoolAccess";
import WithVehicle from "./WithVehicle";
import BelowThreeFeet from "./BelowThreeFeet";
import BelowThreeFeetCondition from "./BelowThreeFeetCondition";
import { IoIosCloseCircle } from "react-icons/io";

const value = {
  name: "",
  below_three_feet: false,
  pool_access: { hasAccess: true },
  with_vehicle: false,
};

export default function StepTwoBookings() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BookingSchema>();

  const { fields, append, remove } = useFieldArray({
    name: "additional_guests",
    control,
  });

  console.log(fields);

  return (
    <div className="h-[60vh] px-[0.75rem] py-[1.5rem] overflow-y-auto shadow-[inset_0_12px_12px_-12px_rgba(0,0,0,0.2),inset_0_-12px_12px_-12px_rgba(0,0,0,0.2)] lg:px-[1rem] lg:py-[1.75rem]">
      <div>
        <h2 className="text-center text-base font-normal mb-[1rem] lg:text-xl lg:mb-[1.25rem] lg:mb-[1.5rem]">
          Additional Guests
        </h2>
      </div>
      <div className="flex flex-col gap-y-10 lg:gap-y-12">
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="border-2 border-secondary-normal/30 rounded-lg p-[1rem] flex flex-col gap-y-5 relative lg:p-[1.25rem] lg:gap-y-6"
            >
              <button
                type="button"
                onClick={() => {
                  remove(index);
                }}
                className="absolute top-[-1rem] right-[-0.25rem] bg-white rounded-full"
              >
                <span className="text-xl">
                  <IoIosCloseCircle />
                </span>
              </button>
              {/* ADDITINAL GUEST NAME */}
              <div>
                <input
                  {...register(`additional_guests.${index}.name`)}
                  type="text"
                  placeholder="Name"
                  aria-describedby={
                    errors.additional_guests?.[index]?.name
                      ? `additionalGuestName${index}-error`
                      : undefined
                  }
                  className="w-full h-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] input-base-focus lg:p-[0.75rem]"
                />
                {errors.additional_guests?.[index]?.name && (
                  <p
                    className="text-red-900 text-[0.65rem] lg:text-xs"
                    id="guestName-error"
                  >
                    {errors.additional_guests[index].name.message}
                  </p>
                )}
              </div>
              {/* ADDITINAL GUEST AGE */}

              <div>
                <input
                  {...register(`additional_guests.${index}.age`, {
                    valueAsNumber: true,
                  })}
                  type="number"
                  placeholder="Age"
                  aria-describedby={
                    errors.additional_guests?.[index]?.age
                      ? `additionalGuestAge${index}-error`
                      : undefined
                  }
                  onWheel={(e) => e.currentTarget.blur()}
                  className="w-full h-full border-2 rounded-lg border-secondary-normal/30 p-[0.5rem] input-base-focus lg:p-[0.75rem]"
                />
                {errors.additional_guests?.[index]?.age && (
                  <p
                    className="text-red-900 text-[0.65rem] lg:text-xs"
                    id="guestAge-error"
                  >
                    {errors.additional_guests[index].age.message}
                  </p>
                )}
              </div>

              {/* ADDITINAL GUEST BELOW THREE FEET */}
              <div>
                <BelowThreeFeet index={index} />
              </div>

              <BelowThreeFeetCondition
                fieldName={`additional_guests.${index}.below_three_feet`}
              >
                <>
                  {/* ADDITIONAL GUEST UPLOAD VALID ID */}
                  <div>
                    <UploadFileParentAdditional index={index} />
                  </div>
                  {/* ADDITIONAL GUEST POOL ACCESS */}
                  <div>
                    <PoolAccess
                      hasAccess={`additional_guests.${index}.pool_access.hasAccess`}
                      name={`additional_guests.${index}.pool_access.access`}
                    />
                  </div>
                  {/* ADDITIONAL GUEST WITH VEHICLE*/}
                  <div>
                    <WithVehicle
                      name={`additional_guests.${index}.with_vehicle`}
                    />
                  </div>
                </>
              </BelowThreeFeetCondition>
            </div>
          );
        })}
      </div>
      <div className="mt-[1rem] flex justify-center">
        <button
          type="button"
          onClick={() => {
            append(value);
          }}
          className="px-[3rem] py-[0.5rem] rounded-lg border-2 border-secondary-normal/30 lg:px-[3.5rem] lg:py-[0.75rem] lg:text-sm"
        >
          <span>Add Guest</span>
        </button>
      </div>
    </div>
  );
}

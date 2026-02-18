"use client";

import { useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import dayjs from "dayjs";
import { endTime, startTime } from "@/app/shared/constants/standardStayTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";
import Image from "next/image";
import { v4 as uuid } from "uuid";

dayjs.extend(customParseFormat);

export default function StepFourBookings() {
  const { getValues } = useFormContext<BookingSchema>();

  const bookings = getValues();

  const {
    check_period,
    name,
    age,
    contact_number,
    nationality,
    pool_access,
    with_vehicle,
    valid_id,
    additional_guests,
  } = bookings;

  return (
    <div className="text-sm px-[0.25rem] h-[60vh] py-[1.5rem] overflow-y-auto shadow-[inset_0_12px_12px_-12px_rgba(0,0,0,0.2),inset_0_-12px_12px_-12px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-y-3 bg-[#efefef] rounded-lg p-[1rem] mt-[1rem]">
        <div className="flex justify-between items-center">
          <span>Check-in</span>
          <div className="font-bold">
            {dayjs(check_period?.check_in).format("dddd, MMM DD,")}{" "}
            {dayjs(startTime, "HH:mm").format("hh:mm A")}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Check-out</span>
          <div className="font-bold">
            {dayjs(check_period?.check_out).format("dddd, MMM DD,")}{" "}
            {dayjs(endTime, "HH:mm").format("hh:mm A")}
          </div>
        </div>
      </div>
      {/* PRIMARY GUEST */}
      <div className="flex flex-col gap-y-3 mt-[1.5rem] bg-[#efefef] rounded-lg p-[1rem]">
        <h3 className="font-bold">Primary Guest</h3>
        <div className="flex justify-between items-center">
          <span>Name</span>
          <div className="font-bold">{name ? name : "Not define"}</div>
        </div>
        <div className="flex justify-between items-center">
          <span>Age</span>
          <div className="font-bold">{age ? age : "Not define"}</div>
        </div>
        <div className="flex justify-between items-center">
          <span>Nationality</span>
          <div className="font-bold">
            {nationality ? nationality : "Not define"}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>Contact Number</span>
          <div className="font-bold">
            {contact_number ? contact_number : "Not define"}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>With Vehicle</span>
          <div className="font-bold">{with_vehicle ? "Yes" : "No"}</div>
        </div>
        <div className="flex justify-between items-start">
          <span>Pool Access</span>
          <div>
            {pool_access.access?.length !== 0 ? (
              <ul className="font-bold text-right flex flex-col gap-y-2 max-h-[5rem] border-b-2 border-secondary-normal/30 overflow-y-auto pb-[0.5rem]">
                {pool_access.access?.map((a) => {
                  if (!a.am && !a.pm) return;
                  return (
                    <li key={a.date}>
                      {dayjs(a.date).format("MMM DD")} -{" "}
                      {a.am && a.pm
                        ? "AM/PM"
                        : a.am
                          ? "AM"
                          : a.pm
                            ? "PM"
                            : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              "None"
            )}
          </div>
        </div>
        {valid_id ? (
          <div className="flex flex-col gap-y-2">
            <span>Valid ID</span>
            <div>
              <PhotoFullViewDialog url={valid_id.url}>
                <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
                  <div className="w-full relative rounded-lg h-full">
                    <Image
                      src={valid_id.url}
                      fill
                      className="object-contain object-center"
                      alt="Amihan Staycaion file upload image for booking"
                      sizes="100%"
                    />
                  </div>
                </div>
              </PhotoFullViewDialog>
            </div>
          </div>
        ) : (
          <div className="flex justify-between gap-y-2">
            <span>Valid ID</span>
            <div>None</div>
          </div>
        )}
      </div>
      {/* ADDITIONAL GUESTS */}

      {additional_guests.length === 0 ? null : (
        <div className="flex flex-col gap-y-3 mt-[1.5rem] bg-[#efefef] rounded-lg p-[1rem]">
          <h3 className="font-bold">Additional Guests</h3>
          <div className="flex flex-col gap-y-5">
            {additional_guests.map((additional_guest, index, arr) => {
              const {
                name,
                age,
                with_vehicle,
                pool_access,
                valid_id,
                below_three_feet,
              } = additional_guest;

              return (
                <div
                  key={uuid()}
                  className={`flex flex-col gap-y-3 pb-[1.5rem] ${arr.length - 1 !== index && "border-b-2 border-secondary-normal/30"}`}
                >
                  <div className="flex justify-between items-center">
                    <span>Name</span>
                    <div className="font-bold">
                      {name ? name : "Not define"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Age</span>
                    <div className="font-bold">{age ? age : "Not define"}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Below 3 Feet</span>
                    <div className="font-bold">
                      {below_three_feet ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>With Vehicle</span>
                    <div className="font-bold">
                      {with_vehicle ? "Yes" : "No"}
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <span>Pool Access</span>
                    <div>
                      {pool_access?.access?.length !== 0 ? (
                        <ul className="font-bold text-right flex flex-col gap-y-2 max-h-[5rem] border-b-2 border-secondary-normal/30 overflow-y-auto pb-[0.5rem]">
                          {pool_access?.access?.map((a) => {
                            if (!a.am && !a.pm) return;
                            return (
                              <li key={a.date}>
                                {dayjs(a.date).format("MMM DD")} -{" "}
                                {a.am && a.pm
                                  ? "AM/PM"
                                  : a.am
                                    ? "AM"
                                    : a.pm
                                      ? "PM"
                                      : null}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        "None"
                      )}
                    </div>
                  </div>
                  {valid_id ? (
                    <div className="flex flex-col gap-y-2">
                      <span>Valid ID</span>
                      <div>
                        <PhotoFullViewDialog url={valid_id.url}>
                          <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
                            <div className="w-full relative rounded-lg h-full">
                              <Image
                                src={valid_id.url}
                                fill
                                className="object-contain object-center"
                                alt="Amihan Staycaion file upload image for booking"
                                sizes="100%"
                              />
                            </div>
                          </div>
                        </PhotoFullViewDialog>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between gap-y-2">
                      <span>Valid ID</span>
                      <div>None</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

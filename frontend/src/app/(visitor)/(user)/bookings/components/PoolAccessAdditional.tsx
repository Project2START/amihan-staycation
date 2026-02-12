"use client";

import { Checkbox, Switch } from "@mantine/core";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { BookingSchema } from "../schema/bookings.schema";
import { getPoolAccessDates } from "@/app/shared/lib/getPoolAccessDates";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";

export default function PoolAccessAdditional({ index }: { index: number }) {
  const [isPoolAccess, setIsPoolAccess] = useState(true);

  const { watch, control } = useFormContext<BookingSchema>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `additional_guests.${index}.pool_access`,
  });

  const checkPeriod = watch("check_period");

  const poolAccessDates = getPoolAccessDates(
    checkPeriod?.check_in,
    checkPeriod?.check_out,
  );

  const handlePoolAccessIndex = (date: string) => {
    const poolAccessIndex = fields.findIndex((field) => field.date === date);

    return poolAccessIndex;
  };
  const handleCheckPoolAccess = (date: string) => {
    const poolAccess = fields.find((field) => field.date === date);
    return poolAccess;
  };

  const below_three_feet = watch(`additional_guests.${index}.below_three_feet`);

  if (below_three_feet) return null;

  return (
    <div className="text-xs text-secondary-normal">
      <div className="max-h-[10rem] overflow-y-auto border-b-2 border-secondary-normal/30 pb-[1rem] mt-[1rem]">
        <div className="flex items-center justify-between sticky top-0 left-0 bg-white z-99 py-[0.5rem]">
          <p className="font-bold">Pool Access</p>
          <Switch
            defaultChecked
            checked={isPoolAccess}
            onChange={(event) => {
              setIsPoolAccess(event.currentTarget.checked);
              remove();
            }}
            color="var(--color-primary-normal)"
            withThumbIndicator={false}
            disabled={typeof poolAccessDates === "string"}
          />
        </div>

        <AnimatePresence>
          {isPoolAccess ? (
            <motion.div
              initial={{ opacity: 0, translateY: "-5%" }}
              animate={{ opacity: 1, translateY: "0%" }}
              exit={{ opacity: 0, translateY: "-5%" }}
              key="user-booking-pool-access-field"
              data-testid="user-booking-pool-access-field"
            >
              {isPoolAccess && (
                <div>
                  <div className="w-[80%]">
                    {typeof poolAccessDates === "string" ? null : (
                      <ul className="w-full flex flex-col gap-y-3 pt-[1.5rem] pb-[1rem]">
                        {poolAccessDates.map((poolAccessDate, index) => {
                          const { date, am, pm } = poolAccessDate;

                          return (
                            <li key={uuid()}>
                              <div className="flex items-center relative">
                                <div className="flex-1/3 ">
                                  {dayjs(date).format("MMMM DD")}
                                </div>
                                <div className="flex-1/3 flex justify-center  ">
                                  {index === 0 && (
                                    <span className="font-bold absolute top-[-150%]">
                                      AM
                                    </span>
                                  )}
                                  {am !== null ? (
                                    <Checkbox
                                      size="xs"
                                      color="var(--color-primary-normal)"
                                      checked={
                                        handleCheckPoolAccess(date)?.am ??
                                        undefined
                                      }
                                      onChange={(event) => {
                                        const poolAccess =
                                          handleCheckPoolAccess(date);

                                        if (!poolAccess) {
                                          append({
                                            date,
                                            am: event.currentTarget.checked,
                                            pm,
                                          });
                                        } else {
                                          const poolAccessIndex =
                                            handlePoolAccessIndex(date);
                                          if (poolAccessIndex === -1) return;

                                          update(poolAccessIndex, {
                                            ...poolAccess,
                                            am: event.currentTarget.checked,
                                          });
                                        }
                                      }}
                                    />
                                  ) : null}
                                </div>
                                <div className="flex-1/3 flex justify-center">
                                  {index === 0 && (
                                    <span className="font-bold absolute top-[-150%]">
                                      PM
                                    </span>
                                  )}
                                  {pm !== null ? (
                                    <Checkbox
                                      size="xs"
                                      color="var(--color-primary-normal)"
                                      checked={
                                        handleCheckPoolAccess(date)?.pm ??
                                        undefined
                                      }
                                      onChange={(event) => {
                                        const poolAccess =
                                          handleCheckPoolAccess(date);

                                        if (!poolAccess) {
                                          append({
                                            date,
                                            am,
                                            pm: event.currentTarget.checked,
                                          });
                                        } else {
                                          const poolAccessIndex =
                                            handlePoolAccessIndex(date);

                                          if (poolAccessIndex === -1) return;

                                          update(poolAccessIndex, {
                                            ...poolAccess,
                                            pm: event.currentTarget.checked,
                                          });
                                        }
                                      }}
                                    />
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {fields.length !== 0 && (
        <p className="py-[0.5rem]">
          <strong className="mr-[0.25rem]">Note:</strong>
          <i>
            Additional fee of ₱250.00 applies for pool access per shift (AM/PM).
          </i>
        </p>
      )}
    </div>
  );
}

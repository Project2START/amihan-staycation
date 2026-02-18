"use client";

import { useState } from "react";
import { Stepper } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import {
  BookingAdditionalGuestsSchema,
  bookingSchema,
  BookingSchema,
} from "../schema/bookings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import StepOneBookings from "./StepOneBookings";
import StepTwoBookings from "./StepTwoBookings";
import StepThreeBookings from "./StepThreeBookings";
import StepFourBookings from "./StepFourBookings";
import { motion } from "motion/react";
import BackPrevPage from "./BackPrevPage";

const stepFields: Record<number, (keyof BookingSchema)[]> = {
  0: [
    "name",
    "age",
    "contact_number",
    "nationality",
    "valid_id",
    "check_period",
  ],
  1: ["additional_guests"],
  2: ["payment_proof"],
};

export default function BookingsForm() {
  const [step, setStep] = useState(0);

  const methods = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      nationality: "Filipino",
      pool_access: { hasAccess: true },
      with_vehicle: false,
      additional_guests: [
        {
          name: "",
          below_three_feet: false,
          pool_access: { hasAccess: true },
          with_vehicle: false,
          valid_id: undefined,
        },
      ],
    },
  });

  const nextStep = () =>
    setStep((currentStep) => (currentStep < 3 ? currentStep + 1 : currentStep));
  const prevStep = () =>
    setStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  const onSubmit = async (data: BookingSchema) => {};

  const onHandleSubmitStep = async () => {
    const isValid = await methods.trigger(stepFields[step], {
      shouldFocus: true,
    });

    if (isValid) {
      nextStep();
    } else if (step === 1 && methods.formState.errors.additional_guests) {
      const guestErrors = methods.formState.errors.additional_guests;

      const index = Array.isArray(guestErrors)
        ? guestErrors.findIndex(Boolean)
        : Object.keys(guestErrors || {}).find((k) =>
            Boolean((guestErrors as any)[k]),
          );

      if (typeof index === "number" && index >= 0) {
        const entry = Array.isArray(guestErrors)
          ? guestErrors[index]
          : (guestErrors as any)[String(index)];
        const firstField = entry && Object.keys(entry)[0];

        if (firstField) {
          methods.setFocus(
            `additional_guests.${index}.${firstField as keyof BookingAdditionalGuestsSchema}`,
          );
        }
      }
    } else {
      const firstError = Object.keys(methods.formState.errors)[0];
      if (firstError) {
        methods.setFocus(firstError as keyof BookingSchema);
      }
    }
  };

  return (
    <div className="px-[1rem] py-[2rem] text-xs text-secondary-normal">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <div className="mb-[1rem] flex justify-between items-center">
              {step === 0 && (
                <div className="flex-1/3">
                  <BackPrevPage />
                </div>
              )}

              <h1 className="text-nowrap grow-1 text-center">
                {step === 2 ? "Book Your Stay" : "Booking Summary"}
              </h1>
              {step === 0 && <div className="flex-1/3"></div>}
            </div>
            <div>
              <Stepper
                color="var(--color-primary-normal)"
                size="xs"
                active={step}
                onStepClick={setStep}
                style={{ marginBottom: "1.5rem" }}
              >
                <Stepper.Step allowStepSelect={false}>
                  <motion.div
                    initial={{ opacity: 0, translateX: "-5%" }}
                    animate={{ opacity: 1, translateX: "0%" }}
                    exit={{ opacity: 0, translateX: "-5%" }}
                    key="user-booking-step-one"
                    data-testid="user-booking-step-one"
                  >
                    <StepOneBookings />
                  </motion.div>
                </Stepper.Step>

                <Stepper.Step allowStepSelect={false}>
                  <motion.div
                    initial={{ opacity: 0, translateX: "-5%" }}
                    animate={{ opacity: 1, translateX: "0%" }}
                    exit={{ opacity: 0, translateX: "-5%" }}
                    key="user-booking-step-two"
                    data-testid="user-booking-step-two"
                  >
                    <StepTwoBookings />
                  </motion.div>
                </Stepper.Step>

                <Stepper.Step allowStepSelect={false}>
                  <motion.div
                    initial={{ opacity: 0, translateX: "-5%" }}
                    animate={{ opacity: 1, translateX: "0%" }}
                    exit={{ opacity: 0, translateX: "-5%" }}
                    key="user-booking-step-three"
                    data-testid="user-booking-step-three"
                  >
                    <StepThreeBookings />
                  </motion.div>
                </Stepper.Step>

                <Stepper.Completed>
                  <motion.div
                    initial={{ opacity: 0, translateX: "-5%" }}
                    animate={{ opacity: 1, translateX: "0%" }}
                    exit={{ opacity: 0, translateX: "-5%" }}
                    key="user-booking-step-completed"
                    data-testid="user-booking-step-completed"
                  >
                    <StepFourBookings />
                  </motion.div>
                </Stepper.Completed>
              </Stepper>
            </div>
            <div>
              <div className="flex justify-evenly gap-x-5 font-bold">
                <button
                  type="button"
                  className="flex-1/2 text-primary-normal py-[0.5rem]"
                  onClick={prevStep}
                  disabled={step === 0}
                >
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="flex-1/2 bg-primary-normal text-white py-[0.5rem] rounded-lg"
                  onClick={onHandleSubmitStep}
                >
                  <span>Next</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Stepper } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { bookingSchema, BookingSchema } from "../schema/bookings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import StepOneBookings from "./StepOneBookings";
import StepTwoBookings from "./StepTwoBookings";
import StepThreeBookings from "./StepThreeBookings";
import StepFourBookings from "./StepFourBookings";
import { motion } from "motion/react";

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
};

export default function BookingsForm() {
  const [step, setStep] = useState(0);

  const methods = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    reValidateMode: "onChange",
    defaultValues: {
      contact_number: {
        callingCode: "+63",
        countryCode: "PH",
      },
      nationality: "Filipino",
    },
  });

  const nextStep = () =>
    setStep((currentStep) => (currentStep < 3 ? currentStep + 1 : currentStep));
  const prevStep = () =>
    setStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  const onSubmit = async (data: BookingSchema) => {};

  const onHandleSubmitStep = async () => {
    console.log(methods.getValues());
    const isValid = await methods.trigger(stepFields[step]);

    if (isValid) {
      nextStep();
    } else {
      for (const field of stepFields[step]) {
        const error = methods.formState.errors[field as keyof BookingSchema];
        if (error) {
          methods.setFocus(field as keyof BookingSchema);
          break;
        }
      }
    }
  };

  return (
    <div className="px-[1rem] py-[2rem] text-xs text-secondary-normal">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <div>
              <h1 className="text-center mb-[1rem]">Book Your Stay</h1>
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

                <Stepper.Step allowStepSelect={true}>
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
            <div className="mt-[3rem]">
              <div className="flex justify-evenly gap-x-5 font-bold">
                <button
                  type="button"
                  className="flex-1/2 text-primary-normal py-[0.5rem]"
                  onClick={prevStep}
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

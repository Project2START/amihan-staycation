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
import { AnimatePresence, motion } from "motion/react";

export default function BookingsForm() {
  const [step, setStep] = useState(0);

  const methods = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contact_number: {
        callingCode: "+63",
        countryCode: "PH",
      },
    },
  });

  const nextStep = () =>
    setStep((currentStep) => (currentStep < 3 ? currentStep + 1 : currentStep));
  const prevStep = () =>
    setStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  const onSubmit = async (data: BookingSchema) => {};

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
                <Stepper.Step>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, translateY: "-5%" }}
                      animate={{ opacity: 1, translateY: "0%" }}
                      exit={{ opacity: 0, translateY: "-5%" }}
                      key="user-booking-step-one"
                      data-testid="user-booking-step-one"
                    >
                      <StepOneBookings />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>

                <Stepper.Step>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, translateY: "-5%" }}
                      animate={{ opacity: 1, translateY: "0%" }}
                      exit={{ opacity: 0, translateY: "-5%" }}
                      key="user-booking-step-two"
                      data-testid="user-booking-step-two"
                    >
                      <StepTwoBookings />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>

                <Stepper.Step>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, translateY: "-5%" }}
                      animate={{ opacity: 1, translateY: "0%" }}
                      exit={{ opacity: 0, translateY: "-5%" }}
                      key="user-booking-step-three"
                      data-testid="user-booking-step-three"
                    >
                      <StepThreeBookings />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>

                <Stepper.Completed>
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, translateY: "-5%" }}
                      animate={{ opacity: 1, translateY: "0%" }}
                      exit={{ opacity: 0, translateY: "-5%" }}
                      key="user-booking-step-completed"
                      data-testid="user-booking-step-completed"
                    >
                      <StepFourBookings />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Completed>
              </Stepper>
            </div>
            <div>
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
                  onClick={nextStep}
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

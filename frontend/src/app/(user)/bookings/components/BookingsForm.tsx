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
import ConfirmBooking from "./ConfirmBooking";
import { useProduct } from "../guard/BookingsGuard";
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { useRouter } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";

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

const maxStep = 3;
const minStep = 0;
const stepMeta = [
  {
    title: "Guest Details",
    description: "Primary guest information and stay dates.",
  },
  {
    title: "Additional Guests",
    description: "Companion details and optional documents.",
  },
  {
    title: "Payment Proof",
    description: "Upload the required proof of payment.",
  },
  {
    title: "Review & Confirm",
    description: "Verify your booking information before submitting.",
  },
];

export default function BookingsForm() {
  const [step, setStep] = useState(0);

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [confirmationDialog, setConfirmationDialog] = useState<boolean>(false);

  const product = useProduct();

  const methods = useForm<BookingSchema>({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
    defaultValues: {
      product_id: product?.id,
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
    setStep((currentStep) =>
      currentStep < maxStep ? currentStep + 1 : currentStep,
    );
  const prevStep = () =>
    setStep((currentStep) =>
      currentStep > minStep ? currentStep - 1 : currentStep,
    );

  const onSubmit = async (data: BookingSchema) => {
    setConfirmLoading(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string") {
        formData.append(key, value);
        return;
      }

      if (key === "additional_guests") {
        let non_files: {}[] = [];
        data["additional_guests"].forEach((additional_guest) => {
          const additional_guest_file = additional_guest.valid_id?.file;

          if (additional_guest_file) {
            formData.append(
              "additional_guests_validIds",
              additional_guest_file,
            );
          }

          const { valid_id, ...rest } = additional_guest;

          non_files.push(rest);
        });
        formData.append("additional_guests", JSON.stringify(non_files));
        return;
      }
      if (key === "payment_proof") {
        const payment_proof_file = data["payment_proof"].file;

        if (payment_proof_file) {
          formData.append("payment_proof", payment_proof_file);
        }
        return;
      }
      if (key === "valid_id") {
        const valid_id_file = data["valid_id"].file;

        if (valid_id_file) {
          formData.append("valid_id", valid_id_file);
        }
        return;
      }
      formData.append(key, JSON.stringify(value));
    });

    try {
      await axios.post(`${HOST}/api/bookings/`, formData, {
        withCredentials: true,
      });
      setConfirmationDialog(true);
    } catch (error) {
      CustomToast.show(errorHandler(error).message, { indicator: "error" });
    } finally {
      setConfirmLoading(false);
    }
  };

  const router = useRouter();

  const handleConfirmationOk = () => {
    setConfirmationDialog(false);
    router.push("/units");
  };

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

  const activeStepMeta = stepMeta[step] || stepMeta[maxStep];

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 text-xs text-secondary-normal sm:px-6 lg:px-8 lg:py-10 lg:text-sm">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
            <aside className="hidden lg:flex lg:flex-col lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-gradient-to-br lg:from-primary-bg/80 lg:to-white lg:p-6 lg:shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-normal/70">
                  Booking Flow
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-secondary-normal">
                  Reserve Your Stay
                </h2>
              </div>

              <div className="space-y-4">
                {stepMeta.map((item, index) => {
                  const isActive = index === step;
                  const isCompleted = index < step;

                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-transparent px-3 py-3 transition-colors duration-200"
                      style={{
                        backgroundColor: isActive
                          ? "var(--color-primary-bg)"
                          : "transparent",
                        borderColor: isActive
                          ? "var(--color-primary-normal)"
                          : "transparent",
                      }}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                          style={{
                            backgroundColor:
                              isCompleted || isActive
                                ? "var(--color-primary-normal)"
                                : "#e5e7eb",
                            color:
                              isCompleted || isActive ? "#ffffff" : "#6b7280",
                          }}
                        >
                          {index + 1}
                        </span>
                        <p
                          className="text-sm font-semibold"
                          style={{
                            color: isActive
                              ? "var(--color-primary-normal)"
                              : "var(--color-secondary-normal)",
                          }}
                        >
                          {item.title}
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed text-secondary-normal/80">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="min-w-0 rounded-2xl bg-white p-0 lg:border lg:border-gray-100 lg:px-8 lg:py-7 lg:shadow-sm xl:px-10 xl:py-8">
              <div className="mb-4 flex items-center justify-between lg:mb-6">
                {step === minStep ? (
                  <div className="flex-1/3">
                    <BackPrevPage />
                  </div>
                ) : (
                  <div className="flex-1/3"></div>
                )}

                <h1 className="flex-1/3 text-nowrap text-center text-xl font-semibold text-secondary-normal lg:text-3xl xl:text-[2rem]">
                  {step === maxStep ? "Booking Summary" : "Book Your Stay"}
                </h1>

                <div className="flex-1/3"></div>
              </div>

              <div className="mb-3 rounded-xl border border-gray-100 bg-white px-3 py-3 lg:hidden">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-normal/70">
                  Step {step + 1}
                </p>
                <p className="mt-1 text-sm font-semibold text-secondary-normal">
                  {activeStepMeta.title}
                </p>
                <p className="mt-0.5 text-[11px] text-secondary-normal/80">
                  {activeStepMeta.description}
                </p>
              </div>

              <div>
                <Stepper
                  color="var(--color-primary-normal)"
                  size="sm"
                  active={step}
                  onStepClick={setStep}
                  style={{ marginBottom: "2rem" }}
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
                {step !== maxStep ? (
                  <div className="flex justify-evenly gap-x-4 font-bold lg:justify-end lg:gap-x-5 xl:gap-x-6">
                    <button
                      type="button"
                      className="flex-1 py-[0.65rem] text-primary-normal disabled:cursor-not-allowed disabled:opacity-50 lg:max-w-[140px] lg:rounded-lg lg:border lg:border-primary-normal"
                      onClick={prevStep}
                      disabled={step === minStep}
                    >
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      className="flex-1 rounded-lg bg-primary-normal py-[0.65rem] text-white lg:max-w-[180px]"
                      onClick={onHandleSubmitStep}
                    >
                      <span>Next</span>
                    </button>
                  </div>
                ) : (
                  <ConfirmBooking
                    confirmLoading={confirmLoading}
                    prevStep={prevStep}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      <DialogBaseContent
        openDialog={confirmationDialog}
        onCloseDialog={() => setConfirmationDialog(false)}
        enableClickOutside={false}
      >
        <div className="flex flex-col items-center p-6 text-center lg:p-7">
          <div className="mb-4 flex items-center flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <AiOutlineCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold lg:text-xl">
              Booking Confirmed
            </h2>
          </div>

          <p className="text-sm text-secondary-normal mb-3 lg:text-base">
            Thank you — we will notify you here in the app for any updates.
          </p>

          <button
            type="button"
            onClick={handleConfirmationOk}
            className="px-16 py-2 rounded-lg text-white lg:py-3 lg:text-base"
            style={{ backgroundColor: "var(--color-primary-normal)" }}
          >
            <span className="font-bold">OK</span>
          </button>
        </div>
      </DialogBaseContent>
    </div>
  );
}

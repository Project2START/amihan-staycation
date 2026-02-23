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
      // CustomToast.show("Booking confirmed successfully", {
      //   indicator: "success",
      // });
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

  return (
    <div className="px-[1rem] pt-[1.5rem] pb-[1rem] text-xs text-secondary-normal">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <div className="mb-[1rem] flex justify-between items-center">
              {step === minStep && (
                <div className="flex-1/3">
                  <BackPrevPage />
                </div>
              )}

              <h1 className="text-nowrap grow-1 text-center">
                {step === maxStep ? "Booking Summary" : "Book Your Stay"}
              </h1>
              {step === minStep && <div className="flex-1/3"></div>}
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
              {step !== maxStep ? (
                <div className="flex justify-evenly gap-x-5 font-bold">
                  <button
                    type="button"
                    className="flex-1/2 text-primary-normal py-[0.5rem]"
                    onClick={prevStep}
                    disabled={step === minStep}
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
              ) : (
                <ConfirmBooking
                  confirmLoading={confirmLoading}
                  prevStep={prevStep}
                />
              )}
            </div>
          </div>
        </form>
      </FormProvider>
      <DialogBaseContent
        openDialog={confirmationDialog}
        onCloseDialog={() => setConfirmationDialog(false)}
        enableClickOutside={false}
      >
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center flex-col gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <AiOutlineCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">Booking Confirmed</h2>
          </div>

          <p className="text-sm text-secondary-normal mb-3">
            Thank you — we will contact you via email or notify you here in the
            app.
          </p>

          <button
            type="button"
            onClick={handleConfirmationOk}
            className="px-16 py-2 rounded-lg text-white"
            style={{ backgroundColor: "var(--color-primary-normal)" }}
          >
            <span className="font-bold">OK</span>
          </button>
        </div>
      </DialogBaseContent>
    </div>
  );
}

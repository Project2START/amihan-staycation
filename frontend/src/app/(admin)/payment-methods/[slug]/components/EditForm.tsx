"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addPaymentMethodSchema,
  AddPaymentMethodSchema,
} from "../../schema/addPaymentMethod.schema";
import SelectPaymentMethod from "../../components/SelectPaymentMethod";
import UploadQrCode from "../../components/UploadQrCode";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { useState } from "react";
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import revalidatePaymentMethods from "../../_actions/revalidatePaymentMethods";
import { useRouter } from "next/navigation";

interface EditFormProps {
  id: string;
  defaultValues: AddPaymentMethodSchema;
}

export default function EditForm({ id, defaultValues }: EditFormProps) {
  const [formError, setFormError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const methods = useForm<AddPaymentMethodSchema>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: AddPaymentMethodSchema) => {
    setFormError(null);
    setLoading(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string") {
        formData.append(key, value);
        return;
      }

      if (key === "qr_code") {
        if (data["qr_code"]?.file) {
          formData.append("qr_code", data["qr_code"].file);
          return;
        }

        return;
      }

      formData.append(key, JSON.stringify(value));
    });

    try {
      await axios.put(`${HOST}/api/paymentMethods/${id}`, formData, {
        withCredentials: true,
      });

      CustomToast.show("Payment method successfully updated", {
        indicator: "success",
      });

      revalidatePaymentMethods();
      router.push("/payment-methods");
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-secondary-normal text-xs px-[1rem] md:px-[1.5rem] lg:px-[2rem] py-[2rem] md:py-[2.5rem] lg:py-[3rem] md:max-w-3xl md:mx-auto">
      <h1 className="text-center text-xl md:text-2xl lg:text-3xl font-bold">
        Edit Payment Method
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[2rem] md:mt-8 lg:mt-10 px-[0.25rem]">
            <div className="md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-6 lg:p-7">
              <div className="hidden md:block mb-5 lg:mb-6">
                <h2 className="text-sm lg:text-base font-semibold text-secondary-normal">
                  Payment Setup
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 mt-1">
                  Update provider info and QR destination details.
                </p>
              </div>

              {/* Payment Method Dropdown */}
              <div className="mb-3 flex flex-col md:mb-6 lg:mb-7">
                <span className="font-bold md:text-sm lg:text-base">
                  Payment Method
                </span>
                <div className="mt-[0.5rem] md:mt-2 lg:mt-3">
                  <SelectPaymentMethod />
                </div>
                {errors.payment_method && (
                  <p
                    className="text-red-900 text-[0.65rem] md:text-xs lg:text-sm mt-1"
                    id="paymentMethod-error"
                  >
                    {errors.payment_method.message}
                  </p>
                )}
              </div>

              {/* QR Code Upload */}
              <div className="mb-3 flex flex-col md:mb-6 lg:mb-7">
                <span className="font-bold md:text-sm lg:text-base">
                  QR Code
                </span>
                <UploadQrCode />
                {errors.qr_code && (
                  <p
                    className="text-red-900 text-[0.65rem] md:text-xs lg:text-sm mt-1"
                    id="qrCode-error"
                  >
                    {errors.qr_code.message ||
                      errors.qr_code.url?.message ||
                      errors.qr_code.id?.message ||
                      errors.qr_code.file?.message ||
                      "QR code is required."}
                  </p>
                )}
              </div>

              <div className="hidden md:block mb-4">
                <h3 className="text-sm lg:text-base font-semibold text-secondary-normal">
                  Account Details
                </h3>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-7">
                {/* Account Name */}
                <div className="flex flex-col md:mb-0">
                  <span className="font-bold md:text-sm lg:text-base">
                    Account Name
                  </span>
                  <input
                    {...register("account_name")}
                    placeholder="Enter account name"
                    type="text"
                    aria-describedby={
                      errors.account_name ? "accountName-error" : undefined
                    }
                    className="mt-[0.5rem] md:mt-2 lg:mt-3 border-b-2 border-secondary-normal/30 py-[0.5rem] md:py-2 lg:py-3 input-base-focus md:text-sm lg:text-base"
                  />
                  {errors.account_name && (
                    <p
                      className="text-red-900 text-[0.65rem] md:text-xs lg:text-sm mt-1"
                      id="accountName-error"
                    >
                      {errors.account_name.message}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div className="flex flex-col mt-[1rem] md:mt-0">
                  <span className="font-bold md:text-sm lg:text-base">
                    Account Number
                  </span>
                  <input
                    {...register("account_number")}
                    placeholder="Enter account number"
                    type="text"
                    aria-describedby={
                      errors.account_number ? "accountNumber-error" : undefined
                    }
                    className="mt-[0.5rem] md:mt-2 lg:mt-3 border-b-2 border-secondary-normal/30 py-[0.5rem] md:py-2 lg:py-3 input-base-focus md:text-sm lg:text-base"
                  />
                  {errors.account_number && (
                    <p
                      className="text-red-900 text-[0.65rem] md:text-xs lg:text-sm mt-1"
                      id="accountNumber-error"
                    >
                      {errors.account_number.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[1.5rem] md:mt-8 lg:mt-10">
            {formError && (
              <p className="text-center text-[0.65rem] md:text-xs pb-[0.5rem] md:pb-2 text-red-900">
                {formError}
              </p>
            )}
            <div className="flex items-center justify-center gap-x-12 md:gap-16 lg:gap-20">
              <div>
                <PrimaryButton
                  variant="text"
                  style={{ backgroundColor: "none" }}
                  onClick={() => router.push("/payment-methods")}
                  disabled={loading}
                >
                  <span className="text-xs md:text-sm normal-case text-secondary-normal">
                    Cancel
                  </span>
                </PrimaryButton>
              </div>
              <div>
                <LoadingOverlay loading={loading}>
                  <PrimaryButton type="submit" disabled={loading}>
                    <span className="text-xs md:text-sm px-[2.5rem] md:px-8 lg:px-10 font-bold">
                      Save
                    </span>
                  </PrimaryButton>
                </LoadingOverlay>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

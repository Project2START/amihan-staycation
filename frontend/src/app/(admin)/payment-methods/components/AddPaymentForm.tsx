"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addPaymentMethodSchema,
  AddPaymentMethodSchema,
} from "../schema/addPaymentMethod.schema";
import SelectPaymentMethod from "./SelectPaymentMethod";
import UploadQrCode from "./UploadQrCode";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { useState } from "react";
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import revalidatePaymentMethods from "../_actions/revalidatePaymentMethods";

interface IAddPaymentFormProps {
  onCloseDialog: () => void;
}

export default function AddPaymentForm({
  onCloseDialog,
}: IAddPaymentFormProps) {
  const [formError, setFormError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const methods = useForm<AddPaymentMethodSchema>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues: {
      payment_method: "",
      account_name: "",
      account_number: "",
    },
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
      await axios.post(`${HOST}/api/paymentMethods`, formData, {
        withCredentials: true,
      });

      CustomToast.show("Payment method successfully created", {
        indicator: "success",
      });

      revalidatePaymentMethods();
      onCloseDialog();
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-secondary-normal text-xs px-[1rem] py-[2rem]">
      <h1 className="text-center text-xl font-bold">Add Payment Method</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[2rem] h-[22rem] overflow-y-auto px-[0.25rem] pb-[1rem]">
            {/* Payment Method Dropdown */}
            <div className="flex flex-col">
              <span className="font-bold">Payment Method</span>
              <div className="mt-[0.5rem]">
                <SelectPaymentMethod />
              </div>
              {errors.payment_method && (
                <p
                  className="text-red-900 text-[0.65rem]"
                  id="paymentMethod-error"
                >
                  {errors.payment_method.message}
                </p>
              )}
            </div>

            {/* QR Code Upload */}
            <div className="flex flex-col mt-[1rem]">
              <span className="font-bold">QR Code</span>
              <UploadQrCode />
              {errors.qr_code && (
                <p className="text-red-900 text-[0.65rem]" id="qrCode-error">
                  {errors.qr_code.message ||
                    errors.qr_code.url?.message ||
                    errors.qr_code.id?.message ||
                    errors.qr_code.file?.message ||
                    "QR code is required."}
                </p>
              )}
            </div>

            {/* Account Name */}
            <div className="flex flex-col mt-[1rem]">
              <span className="font-bold">Account Name</span>
              <input
                {...register("account_name")}
                placeholder="Enter account name"
                type="text"
                aria-describedby={
                  errors.account_name ? "accountName-error" : undefined
                }
                className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
              />
              {errors.account_name && (
                <p
                  className="text-red-900 text-[0.65rem]"
                  id="accountName-error"
                >
                  {errors.account_name.message}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div className="flex flex-col mt-[1rem]">
              <span className="font-bold">Account Number</span>
              <input
                {...register("account_number")}
                placeholder="Enter account number"
                type="text"
                aria-describedby={
                  errors.account_number ? "accountNumber-error" : undefined
                }
                className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
              />
              {errors.account_number && (
                <p
                  className="text-red-900 text-[0.65rem]"
                  id="accountNumber-error"
                >
                  {errors.account_number.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-[1rem]">
            {formError && (
              <p className="text-center text-[0.65rem] pb-[0.5rem] text-red-900">
                {formError}
              </p>
            )}
            <div className="flex items-center justify-center gap-x-7.5">
              <div>
                <PrimaryButton
                  variant="text"
                  style={{ backgroundColor: "none" }}
                  onClick={onCloseDialog}
                  disabled={loading}
                >
                  <span className="text-xs normal-case text-secondary-normal">
                    Cancel
                  </span>
                </PrimaryButton>
              </div>
              <div>
                <LoadingOverlay loading={loading}>
                  <PrimaryButton type="submit" disabled={loading}>
                    <span className="text-xs px-[2.5rem] font-bold">Save</span>
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

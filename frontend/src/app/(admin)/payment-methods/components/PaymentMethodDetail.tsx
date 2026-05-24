"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { IoClose } from "react-icons/io5";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import getPaymentOptions from "@/app/shared/lib/getPaymentOptions";
import type { IPaymentMethod } from "../types/paymentMethod.types";

export default function PaymentMethodDetail({
  method,
  open,
  onClose,
  enableClickOutside,
  onDeleteClick,
}: {
  method: IPaymentMethod | null;
  open: boolean;
  onClose: () => void;
  enableClickOutside: boolean;
  onDeleteClick: () => void;
}) {
  const router = useRouter();
  const paymentOptions = useMemo(() => getPaymentOptions(), []);

  const logo = method
    ? paymentOptions.find(
        (opt) =>
          opt.paymentName.toLowerCase() === method.payment_method.toLowerCase(),
      )?.paymentImage
    : null;

  return (
    <DialogBaseContent
      openDialog={open}
      onCloseDialog={onClose}
      enableClickOutside={enableClickOutside}
    >
      {method && (
        <div className="relative text-secondary-normal">
          {/* Top-right actions */}
          <div className="absolute top-3 md:top-5 lg:top-6 right-3 md:right-5 lg:right-6 flex items-center gap-x-3 md:gap-x-4 lg:gap-x-5 z-10">
            <button
              className="text-lg md:text-xl lg:text-2xl text-gray-400 hover:text-secondary-normal transition-colors cursor-pointer"
              type="button"
              onClick={() => {
                if (method) {
                  router.push(`/payment-methods/${method.id}`);
                }
              }}
            >
              <span className="text-xl">
                <GoPencil />
              </span>
            </button>
            <button
              type="button"
              onClick={onDeleteClick}
              className="text-lg md:text-xl lg:text-2xl text-reject-normal hover:text-reject-normal/80 transition-colors cursor-pointer"
            >
              <span className="text-xl">
                <RiDeleteBin6Line />
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xl md:text-2xl lg:text-3xl text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <span className="text-xl">
                <IoClose />
              </span>
            </button>
          </div>

          {/* QR Code / Image */}
          <div className="relative flex justify-center items-center bg-gray-50 rounded-t-lg py-10 md:py-14 lg:py-20">
            {logo && (
              <div className="absolute top-3 md:top-5 lg:top-6 left-3 md:left-5 lg:left-6 w-7 md:w-8 lg:w-10 h-7 md:h-8 lg:h-10">
                <Image
                  src={logo}
                  alt={method.payment_method}
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
            )}
            <div className="relative w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48">
              <Image
                src={method.image_url}
                alt={method.payment_method}
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          </div>

          {/* Details */}
          <div className="px-6 md:px-8 lg:px-10 py-5 md:py-7 lg:py-8 flex flex-col gap-y-4 md:gap-y-5 lg:gap-y-6 text-xs md:text-sm">
            <div className="text-center">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold">
                {method.payment_method}
              </h2>
            </div>

            <div className="border-t border-secondary-normal/10 pt-4 md:pt-5 lg:pt-6">
              <div className="grid grid-cols-1 gap-y-3 md:gap-y-4">
                <div className="flex justify-between items-center gap-3">
                  <span className="text-gray-500 md:text-base">
                    Account Name
                  </span>
                  <span className="font-bold md:text-base text-right">
                    {method.account_name}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-gray-500 md:text-base">
                    Account Number
                  </span>
                  <span className="font-bold md:text-base text-right">
                    {method.account_number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogBaseContent>
  );
}

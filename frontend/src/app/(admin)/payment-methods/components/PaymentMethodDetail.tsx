"use client";

import Image from "next/image";
import { useMemo } from "react";
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
          <div className="absolute top-3 right-3 flex items-center gap-x-3 z-10">
            <button
              type="button"
              className="text-lg text-gray-400 hover:text-secondary-normal transition-colors cursor-pointer"
            >
              <span className="text-xl">
                <GoPencil />
              </span>
            </button>
            <button
              type="button"
              onClick={onDeleteClick}
              className="text-lg text-reject-normal hover:text-reject-normal/80 transition-colors cursor-pointer"
            >
              <span className="text-xl">
                <RiDeleteBin6Line />
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xl text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <span className="text-xl">
                <IoClose />
              </span>
            </button>
          </div>

          {/* QR Code / Image */}
          <div className="relative flex justify-center items-center bg-gray-50 rounded-t-lg py-10">
            {logo && (
              <div className="absolute top-3 left-3 w-7 h-7">
                <Image
                  src={logo}
                  alt={method.payment_method}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
            )}
            <div className="relative w-32 h-32">
              <Image
                src={method.image_url}
                alt={method.payment_method}
                fill
                className="object-contain"
                sizes="128px"
              />
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-5 flex flex-col gap-y-4 text-xs">
            <div className="text-center">
              <h2 className="text-lg font-bold">{method.payment_method}</h2>
            </div>

            <div className="flex flex-col gap-y-3 border-t border-secondary-normal/10 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Account Name</span>
                <span className="font-bold">{method.account_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Account Number</span>
                <span className="font-bold">{method.account_number}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DialogBaseContent>
  );
}

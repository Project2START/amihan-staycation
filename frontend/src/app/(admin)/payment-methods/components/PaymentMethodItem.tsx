"use client";

import Image from "next/image";
import { useMemo } from "react";
import { FaChevronRight } from "react-icons/fa";
import getPaymentOptions from "@/app/shared/lib/getPaymentOptions";
import type { IPaymentMethod } from "../types/paymentMethod.types";

export default function PaymentMethodItem({
  method,
  onClick,
}: {
  method: IPaymentMethod;
  onClick: () => void;
}) {
  const paymentOptions = useMemo(() => getPaymentOptions(), []);

  const logo = paymentOptions.find(
    (opt) =>
      opt.paymentName.toLowerCase() === method.payment_method.toLowerCase(),
  )?.paymentImage;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-x-4 px-3 py-5 md:px-5 md:py-5 lg:px-6 lg:py-6 bg-white rounded-lg md:rounded-xl shadow-sm border border-secondary-normal/10 hover:bg-gray-50 md:hover:bg-sky-50 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4 flex-1 text-left">
        <div className="relative w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={logo ?? method.image_url}
            alt={method.payment_method}
            fill
            className="object-contain"
            sizes="40px"
          />
        </div>
        <div className="flex flex-col items-start text-left min-w-0">
          <span className="font-bold text-sm md:text-base text-secondary-normal group-hover:text-sky-700 transition-colors">
            {method.payment_method}
          </span>
          <span className="text-xs md:text-sm text-gray-500 truncate max-w-full">
            {method.account_number} - {method.account_name}
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center text-gray-400 group-hover:text-sky-700 transition-colors">
        <FaChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
      </div>
    </button>
  );
}

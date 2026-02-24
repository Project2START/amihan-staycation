"use client";

import Image from "next/image";
import { useMemo } from "react";
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
      className="w-full flex items-center gap-x-4 px-3 py-5 bg-white rounded-lg shadow-sm border border-secondary-normal/10 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="relative w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={logo ?? method.image_url}
          alt={method.payment_method}
          fill
          className="object-contain"
          sizes="40px"
        />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="font-bold text-sm text-secondary-normal">
          {method.payment_method}
        </span>
        <span className="text-xs text-gray-500">
          {method.account_number} - {method.account_name}
        </span>
      </div>
    </button>
  );
}

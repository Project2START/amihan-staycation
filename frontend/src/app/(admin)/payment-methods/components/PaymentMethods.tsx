import { notFound } from "next/navigation";
import AddPaymentMethodDesktop from "./AddPaymentMethodDesktop";
import PaymentMethodList from "./PaymentMethodList";
import type { IPaymentMethod } from "../types/paymentMethod.types";
import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";

export default async function PaymentMethods() {
  const result = await fetchWithAuth("api/paymentMethods/", {
    cache: "no-cache",
    method: "GET",
  });

  if (!result.ok) {
    return notFound();
  }

  const parsed: { message: string; payment_methods: IPaymentMethod[] } =
    await result.json();

  return (
    <div className="p-4 md:p-7 lg:p-8 mt-[1.5rem] md:mt-6 lg:mt-7">
      <div className="hidden md:flex items-center justify-between rounded-xl border border-secondary-normal/10 bg-white px-6 py-5 lg:px-7 lg:py-6 mb-6 lg:mb-8 shadow-sm">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary-normal">
            Payment Methods
          </h1>
          <p className="text-sm lg:text-base text-gray-500 mt-1">
            Manage checkout channels and QR destinations in one place.
          </p>
        </div>
        <AddPaymentMethodDesktop />
      </div>

      <PaymentMethodList paymentMethods={parsed.payment_methods} />
    </div>
  );
}

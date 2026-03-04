import { notFound } from "next/navigation";
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
    <div className="p-4 mt-[1.5rem]">
      <PaymentMethodList paymentMethods={parsed.payment_methods} />
    </div>
  );
}

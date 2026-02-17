import { HOST } from "@/app/shared/constants/config";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import PaymentMethodList from "./PaymentMethodList";
import type { IPaymentMethod } from "../types/paymentMethod.types";

export default async function PaymentMethods() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return notFound();
  }

  const result = await fetch(`${HOST}/api/paymentMethods/`, {
    cache: "no-cache",
    method: "GET",
    headers: {
      cookie: `auth_token=${authToken}`,
    },
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

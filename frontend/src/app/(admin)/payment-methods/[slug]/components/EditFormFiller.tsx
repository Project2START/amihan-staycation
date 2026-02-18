import { HOST } from "@/app/shared/constants/config";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import EditForm from "./EditForm";
import { AddPaymentMethodSchema } from "../../schema/addPaymentMethod.schema";

export default async function EditFormFiller({ slug }: { slug: string }) {
  if (!slug) {
    return notFound();
  }

  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  if (!authToken) {
    return notFound();
  }

  const result = await fetch(`${HOST}/api/paymentMethods/${slug}`, {
    cache: "no-cache",
    method: "GET",
    headers: {
      cookie: `auth_token=${authToken}`,
    },
  });

  if (!result.ok) {
    return notFound();
  }

  const parsed: { message: string; payment_method: any } = await result.json();

  const defaultValues: AddPaymentMethodSchema = {
    payment_method: parsed.payment_method.payment_method || "",
    account_name: parsed.payment_method.account_name || "",
    account_number: parsed.payment_method.account_number || "",
    qr_code: parsed.payment_method.qr_code || {
      url: parsed.payment_method.image_url || "",
      id: parsed.payment_method.id || "",
    },
  };

  return (
    <EditForm id={parsed.payment_method.id} defaultValues={defaultValues} />
  );
}

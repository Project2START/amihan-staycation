"use client";

import { useEffect, useState } from "react";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import NotFoundClient from "@/app/shared/components/NotFoundClient";
import EditForm from "./EditForm";
import EditFormSkeleton from "./EditFormSkeleton";
import { AddPaymentMethodSchema } from "../../schema/addPaymentMethod.schema";

export default function EditFormFiller({ slug }: { slug: string }) {
  const [defaultValues, setDefaultValues] =
    useState<AddPaymentMethodSchema | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchPaymentMethod = async () => {
      try {
        const result = await fetchWithAuthClient(
          `api/paymentMethods/${slug}`,
          {
            cache: "no-cache",
            method: "GET",
          },
        );

        if (!result.ok) {
          if (mounted) setError(true);
          return;
        }

        const parsed: { message: string; payment_method: any } =
          await result.json();

        if (mounted) {
          setPaymentMethodId(parsed.payment_method.id);
          setDefaultValues({
            payment_method: parsed.payment_method.payment_method || "",
            account_name: parsed.payment_method.account_name || "",
            account_number: parsed.payment_method.account_number || "",
            qr_code: parsed.payment_method.qr_code || {
              url: parsed.payment_method.image_url || "",
              id: parsed.payment_method.id || "",
            },
          });
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPaymentMethod();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <EditFormSkeleton />;
  }

  if (error || !defaultValues) {
    return <NotFoundClient />;
  }

  return <EditForm id={paymentMethodId} defaultValues={defaultValues} />;
}

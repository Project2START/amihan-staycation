"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import AddPaymentMethodDesktop from "./AddPaymentMethodDesktop";
import PaymentMethodList from "./PaymentMethodList";
import type { IPaymentMethod } from "../types/paymentMethod.types";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import NotFoundClient from "@/app/shared/components/NotFoundClient";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchPaymentMethods = async () => {
      try {
        const result = await fetchWithAuthClient("api/paymentMethods/", {
          cache: "no-cache",
          method: "GET",
        });

        if (!result.ok) {
          if (mounted) setError(true);
          return;
        }

        const parsed: { message: string; payment_methods: IPaymentMethod[] } =
          await result.json();

        if (mounted) {
          setPaymentMethods(parsed.payment_methods ?? []);
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPaymentMethods();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-7 lg:p-8 mt-[1.5rem] md:mt-6 lg:mt-7">
        <div className="hidden md:flex items-center justify-between rounded-xl border border-secondary-normal/10 bg-white px-6 py-5 lg:px-7 lg:py-6 mb-6 lg:mb-8 shadow-sm">
          <div className="space-y-2">
            <Skeleton variant="rounded" width={220} height={32} />
            <Skeleton variant="rounded" width={360} height={16} />
          </div>
          <Skeleton variant="rounded" width={180} height={42} />
        </div>

        <div className="grid gap-y-5 md:gap-4 lg:gap-5 md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-5 lg:p-6 md:shadow-sm">
          <Skeleton variant="rounded" height={70} />
          <Skeleton
            variant="rounded"
            height={80}
            className="md:!h-22 lg:!h-24"
          />
          <Skeleton
            variant="rounded"
            height={80}
            className="md:!h-22 lg:!h-24"
          />
          <Skeleton
            variant="rounded"
            height={80}
            className="md:!h-22 lg:!h-24"
          />
          <Skeleton
            variant="rounded"
            height={80}
            className="md:!h-22 lg:!h-24"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return <NotFoundClient />;
  }

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

      <PaymentMethodList paymentMethods={paymentMethods} />
    </div>
  );
}

"use client";
import NotFoundClient from "@/app/shared/components/NotFoundClient";
import { HOST } from "@/app/shared/constants/config";
import { useSearchParams, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { Skeleton } from "@mantine/core";
import { Product } from "../../units/[slug]/components/Product";
import axios from "axios";
import { useAppSelector } from "@/lib/hooks";

const ProductContext = createContext<Product | undefined>(undefined);

export function useProduct() {
  return useContext(ProductContext);
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  let data: any = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    (error as any).status = res.status;
    (error as any).info = data;
    throw error;
  }

  return data;
};

function BookingsFormSkeleton() {
  return (
    <div className="px-[1rem] py-[2rem] text-xs">
      {/* Header with back button and title */}
      <div className="mb-[1rem] flex items-center justify-between">
        <div className="flex-1/3">
          <Skeleton height={24} width={24} circle />
        </div>
        <Skeleton height={16} width={120} className="grow-1 text-center" />
        <div className="flex-1/3" />
      </div>

      {/* Stepper indicators */}
      <div className="mb-[1.5rem] flex items-center justify-between gap-2">
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            <Skeleton height={24} width={24} circle />
            {i < 3 && <Skeleton height={4} className="flex-1" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step content area — mimics StepOneBookings fields */}
      <div className="flex flex-col gap-y-4">
        {/* Name field */}
        <div>
          <Skeleton height={12} width={80} mb={6} />
          <Skeleton height={36} radius="sm" />
        </div>
        {/* Age field */}
        <div>
          <Skeleton height={12} width={50} mb={6} />
          <Skeleton height={36} radius="sm" />
        </div>
        {/* Contact number field */}
        <div>
          <Skeleton height={12} width={110} mb={6} />
          <Skeleton height={36} radius="sm" />
        </div>
        {/* Nationality field */}
        <div>
          <Skeleton height={12} width={80} mb={6} />
          <Skeleton height={36} radius="sm" />
        </div>
        {/* Valid ID upload */}
        <div>
          <Skeleton height={12} width={70} mb={6} />
          <Skeleton height={80} radius="sm" />
        </div>
        {/* Check period / calendar */}
        <div>
          <Skeleton height={12} width={100} mb={6} />
          <Skeleton height={36} radius="sm" />
        </div>
      </div>

      {/* Back / Next buttons */}
      <div className="mt-6 flex justify-evenly gap-x-5 font-bold">
        <Skeleton height={36} radius="sm" className="flex-1/2" />
        <Skeleton height={36} radius="md" className="flex-1/2" />
      </div>
    </div>
  );
}

export default function BookingsGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const user = useAppSelector((state) => state.users.data);
  const [checkingExistingBooking, setCheckingExistingBooking] =
    useState<boolean>(true);

  if (!productId) {
    return <NotFoundClient />;
  }

  useEffect(() => {
    let mounted = true;

    const checkExistingBooking = async () => {
      if (!productId) {
        if (mounted) setCheckingExistingBooking(false);
        return;
      }

      if (user?.role === "agent") {
        if (mounted) setCheckingExistingBooking(false);
        return;
      }

      try {
        const result = await axios.get(`${HOST}/api/bookings/me`, {
          params: { service: "existingBooking" },
          withCredentials: true,
        });

        if (!mounted) return;

        if (result.data?.booking) {
          router.replace(`/units/${productId}`);
          return;
        }
      } catch {
        // Let the regular bookings guard continue if this check fails.
      } finally {
        if (mounted) setCheckingExistingBooking(false);
      }
    };

    void checkExistingBooking();

    return () => {
      mounted = false;
    };
  }, [productId, router, user?.role]);

  const { error, isLoading, data } = useSWR(
    `${HOST}/api/products/${productId}`,
    fetcher,
  );

  if (isLoading || checkingExistingBooking) {
    return <BookingsFormSkeleton />;
  }
  if (error) {
    return <NotFoundClient />;
  }

  return (
    <ProductContext.Provider value={data.product}>
      {children}
    </ProductContext.Provider>
  );
}

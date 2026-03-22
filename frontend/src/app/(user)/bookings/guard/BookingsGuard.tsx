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
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6 text-xs text-secondary-normal sm:px-6 lg:px-8 lg:py-10 lg:text-sm">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
        <aside className="hidden lg:flex lg:flex-col lg:rounded-2xl lg:border lg:border-gray-100 lg:bg-gradient-to-br lg:from-primary-bg/80 lg:to-white lg:p-6 lg:shadow-sm">
          <div className="mb-6">
            <Skeleton height={10} width={100} mb={12} />
            <Skeleton height={30} width={220} radius="sm" />
          </div>

          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white/60 px-3 py-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Skeleton height={24} width={24} circle />
                  <Skeleton height={12} width={140} radius="sm" />
                </div>
                <Skeleton height={10} width="85%" mb={6} />
                <Skeleton height={10} width="65%" />
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-xl bg-white p-4 shadow-sm">
            <Skeleton height={9} width={90} mb={10} />
            <Skeleton height={14} width={160} mb={8} radius="sm" />
            <Skeleton height={10} width="90%" mb={6} />
            <Skeleton height={10} width="70%" />
          </div>
        </aside>

        <div className="min-w-0 rounded-2xl bg-white p-0 lg:border lg:border-gray-100 lg:px-8 lg:py-7 lg:shadow-sm xl:px-10 xl:py-8">
          {/* Header with back button and title */}
          <div className="mb-4 flex items-center justify-between lg:mb-6">
            <div className="flex-1/3">
              <Skeleton height={24} width={24} circle />
            </div>
            <div className="flex-1/3 flex justify-center">
              <Skeleton height={24} width={190} radius="sm" />
            </div>
            <div className="flex-1/3" />
          </div>

          {/* Mobile step summary */}
          <div className="mb-3 rounded-xl border border-gray-100 bg-white px-3 py-3 lg:hidden">
            <Skeleton height={8} width={70} mb={8} />
            <Skeleton height={12} width={130} mb={6} radius="sm" />
            <Skeleton height={10} width="85%" />
          </div>

          {/* Stepper indicators */}
          <div className="mb-8 flex items-center justify-between gap-2">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton height={24} width={24} circle />
                {i < 3 && <Skeleton height={4} className="flex-1" />}
              </React.Fragment>
            ))}
          </div>

          {/* Step content area */}
          <div className="flex flex-col gap-y-4">
            <div>
              <Skeleton height={12} width={80} mb={6} />
              <Skeleton height={38} radius="sm" />
            </div>
            <div>
              <Skeleton height={12} width={50} mb={6} />
              <Skeleton height={38} radius="sm" />
            </div>
            <div>
              <Skeleton height={12} width={110} mb={6} />
              <Skeleton height={38} radius="sm" />
            </div>
            <div>
              <Skeleton height={12} width={80} mb={6} />
              <Skeleton height={38} radius="sm" />
            </div>
            <div>
              <Skeleton height={12} width={70} mb={6} />
              <Skeleton height={84} radius="sm" />
            </div>
            <div>
              <Skeleton height={12} width={100} mb={6} />
              <Skeleton height={38} radius="sm" />
            </div>
          </div>

          {/* Back / Next buttons */}
          <div className="mt-6 flex justify-evenly gap-x-4 font-bold lg:justify-end lg:gap-x-5 xl:gap-x-6">
            <Skeleton
              height={40}
              radius="sm"
              className="flex-1 lg:max-w-[140px]"
            />
            <Skeleton
              height={40}
              radius="md"
              className="flex-1 lg:max-w-[180px]"
            />
          </div>
        </div>
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

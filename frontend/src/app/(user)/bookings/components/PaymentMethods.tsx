"use client";
import { HOST } from "@/app/shared/constants/config";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { Skeleton } from "@mantine/core";
import NotFoundClient from "@/app/shared/components/NotFoundClient";
import getPaymentOptions from "@/app/shared/lib/getPaymentOptions";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";
import Image from "next/image";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import type { BookingSchema } from "../schema/bookings.schema";
import { getAuthHeader } from "@/app/shared/lib/getAuthToken";

interface IPaymentMethods {
  account_name: string;
  account_number: string;
  image_url: string;
  id: string;
  payment_method: string;
}

export const fetcher = async (url: string) => {
  const authHeader = await getAuthHeader();
  const res = await fetch(url, { headers: authHeader });

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

function PaymentMethodsSkeleton() {
  return (
    <div className="py-4">
      {/* Big QR preview placeholder */}
      <div className="mx-auto max-w-[16rem]">
        <Skeleton height={256} radius="md" />
      </div>

      {/* Account info placeholder */}
      <div className="mt-2 flex flex-col items-center gap-y-1">
        <Skeleton height={14} width={100} />
        <Skeleton height={10} width={160} />
      </div>

      {/* Horizontal thumbnail list placeholder */}
      <div className="mt-4 flex gap-x-3 px-1">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height={48} width={48} radius="md" />
        ))}
      </div>
    </div>
  );
}

function getPaymentLogo(paymentMethod: string): string {
  const options = getPaymentOptions();
  const match = options.find(
    (opt) => opt.paymentName.toLowerCase() === paymentMethod.toLowerCase(),
  );
  return match?.paymentImage ?? "/images/payment-logos/default.png";
}

export default function PaymentMethods() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const { setValue, getValues } = useFormContext<BookingSchema>();

  const { data, error, isLoading } = useSWR<{
    message: string;
    payment_methods: IPaymentMethods[];
  }>(
    `${HOST}/api/paymentMethods/public_products?productId=${productId}`,
    fetcher,
  );

  const currentPaymentMethod = getValues("payment_method_id");

  const items = data?.payment_methods ?? [];

  const selected =
    items.find((item) => item.id === currentPaymentMethod) ?? items[0] ?? null;

  console.log(currentPaymentMethod);
  useEffect(() => {
    if (selected) {
      setValue("payment_method_id", selected.id, {
        shouldValidate: true,
      });
    }
  }, [selected, setValue]);

  if (error) return <NotFoundClient />;
  if (isLoading) return <PaymentMethodsSkeleton />;
  if (items.length === 0) return null;

  const handleSelect = (index: number) => {
    setValue("payment_method_id", items[index].id, {
      shouldValidate: true,
    });
    setValue("payment_type", items[index].payment_method, {
      shouldValidate: true,
    });
  };

  return (
    <div className="py-4 rounded-lg border-2 border-secondary-normal/30 p-4 my-5">
      {/* Big QR code preview */}
      <PhotoFullViewDialog url={selected.image_url}>
        <div className="bg-[#efefef] rounded-lg py-[1rem]">
          <div className="relative mx-auto w-full aspect-square max-w-[14rem] overflow-hidden">
            <Image
              src={selected.image_url}
              fill
              alt={`${selected.payment_method} QR Code`}
              className="object-contain object-center"
              sizes="224px"
            />
          </div>
        </div>
      </PhotoFullViewDialog>

      {/* Account info */}
      <div className="mt-2 text-center">
        <p className="text-xs">{selected.payment_method}</p>
        <p className="text-sm font-bold">
          {selected.account_name} &middot; {selected.account_number}
        </p>
      </div>

      {/* Horizontal scrollable thumbnail list */}
      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-x-3 w-max px-1 pb-2">
          {items.map((method, index) => (
            <button
              key={method.id}
              type="button"
              onClick={() => handleSelect(index)}
              className={`relative h-[2.5rem] w-[2.5rem] flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors hover-animation lg:hover:opacity-50 ${
                method.id === currentPaymentMethod
                  ? "border-primary-normal"
                  : "border-secondary-normal/30"
              }`}
            >
              <Image
                src={getPaymentLogo(method.payment_method)}
                fill
                alt={method.payment_method}
                className="object-contain object-center p-1"
                sizes="40px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

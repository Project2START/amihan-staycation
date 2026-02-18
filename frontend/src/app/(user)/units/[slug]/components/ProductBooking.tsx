"use client";

import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

export default function ProductBooking({ productId }: { productId: string }) {
  const user = useAppSelector((state) => state.users.data);

  return (
    <div className="mt-[2.5rem] flex justify-center">
      <Link
        href={user ? `/bookings?id=${productId}` : `/sign-in`}
        className="w-[80%] text-white bg-primary-normal font-bold rounded-lg py-[1rem] text-center text-xs"
      >
        Book Now
      </Link>
    </div>
  );
}

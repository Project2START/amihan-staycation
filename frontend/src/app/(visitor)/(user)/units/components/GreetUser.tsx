"use client";

import { useAppSelector } from "@/lib/hooks";

export default function GreetUser() {
  const user = useAppSelector((state) => state.users.data);

  return (
    <div className="text-center">
      <h1>Welcome, {user?.first_name}</h1>
      <p className="text-sm mt-[0.5rem]">
        Pick the Perfect Spot for Your Getaway
      </p>
    </div>
  );
}

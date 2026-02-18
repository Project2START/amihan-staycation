"use client";

import { useAppSelector } from "@/lib/hooks";

export default function GreetUser() {
  const user = useAppSelector((state) => state.users.data);

  return (
    <div className="text-center text-secondary-normal">
      <h1>{user ? `Welcome, ${user.first_name}` : "Hey there! Welcome"}</h1>
      <p className="text-sm mt-[0.5rem]">
        Pick the Perfect Spot for Your Getaway
      </p>
    </div>
  );
}

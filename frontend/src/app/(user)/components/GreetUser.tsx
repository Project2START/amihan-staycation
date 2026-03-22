"use client";

import { useAppSelector } from "@/lib/hooks";

export default function GreetUser() {
  const user = useAppSelector((state) => state.users.data);

  return (
    <div className="text-center text-secondary-normal lg:pt-[1.5rem]">
      <h1 className="md:text-3xl lg:text-5xl ">
        {user ? `Welcome, ${user.first_name}` : "Hey there! Welcome"}
      </h1>
      <p className="text-sm mt-[0.5rem] md:text-base md:mt-[1rem] lg:text-lg lg:mt-[1rem]">
        Pick the Perfect Spot for Your Getaway
      </p>
    </div>
  );
}

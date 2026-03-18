"use client";

import { ReactTyped } from "react-typed";

export default function HeroTag() {
  return (
    <p className="mt-2 text-[0.72rem]/7 text-shadow-lg sm:mt-3 sm:text-xs/8 md:mt-4 md:text-sm/9 lg:mt-5 lg:text-lg/10 xl:text-xl/10 2xl:text-2xl/12 min-[1921px]:text-[1.85rem]/13">
      Relax and make memories with loved ones at{" "}
      <span className="font-bold text-primary-normal">Amihan Staycation</span> —{" "}
      <span className="md:hidden">your private escape for </span>
      <span className="hidden md:inline">
        Experience the little things that make every stay special:{" "}
      </span>
      <span className="font-bold underline decoration-double decoration-primary-normal lg:text-2xl xl:text-3xl 2xl:text-4xl min-[1921px]:text-[2.9rem]">
        <ReactTyped
          strings={[
            "comfort",
            "serenity",
            "family moments",
            "slow mornings",
            "peace",
          ]}
          typeSpeed={60}
          backSpeed={40}
          loop
        />
      </span>
    </p>
  );
}

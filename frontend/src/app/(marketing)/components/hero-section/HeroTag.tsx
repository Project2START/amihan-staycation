"use client";

import { ReactTyped } from "react-typed";

export default function HeroTag() {
  return (
    <p className="text-shadow-lg text-xs/8 mt-[0.5rem] md:text-sm/10">
      Relax and make memories with loved ones at{" "}
      <span className="font-bold text-primary-normal">Amihan Staycation</span> —{" "}
      <span className="md:hidden">your private escape for </span>
      <span className="hidden md:inline">
        Experience the little things that make every stay special:{" "}
      </span>
      <span className="font-bold underline decoration-double decoration-primary-normal lg:text-lg ">
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

"use client";

import Link from "next/link";
import ImageMainLogo from "./ImageMainLogo";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "motion/react";

export default function HeaderPromptAuth() {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
    initialInView: true,
  });

  return (
    <>
      <div
        ref={ref}
        className="shadow-md/30 bg-white p-[1rem] md:px-[2rem] lg:px-[3rem] lg:py-[1.25rem]"
        style={inView ? { visibility: "visible" } : { visibility: "hidden" }}
      >
        <div className="flex justify-between items-center">
          <ImageMainLogo />

          <div className="flex text-xs">
            <Link
              href={"/sign-up"}
              className="primary-button-link px-[1.75rem] py-[0.75rem] lg:px-[2.5rem] lg:py-[1rem]"
            >
              <span className="lg:text-base">Sign Up</span>
            </Link>
            <Link
              href={"/sign-in"}
              className="primary-button-link text-primary-normal text-shadow-lg bg-transparent px-[1.75rem] py-[0.75rem] lg:px-[2.5rem] lg:py-[1rem]"
            >
              <span className="lg:text-base">Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!inView && (
          <motion.div
            initial={{ translateY: "-100%" }}
            animate={{ translateY: "0%" }}
            exit={{ translateY: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="shadow-md/30 bg-white p-[1rem] fixed top-0 z-999 w-full md:px-[2rem] lg:px-[3rem] lg:py-[1.25rem]"
          >
            <div className="flex justify-between items-center">
              <ImageMainLogo />

              <div className="flex text-xs">
                <Link
                  href={"/sign-up"}
                  className="primary-button-link px-[1.75rem] py-[0.75rem] lg:px-[2.5rem] lg:py-[1rem]"
                >
                  <span className="lg:text-base">Sign Up</span>
                </Link>
                <Link
                  href={"/sign-in"}
                  className="primary-button-link text-primary-normal text-shadow-lg bg-transparent px-[1.75rem] py-[0.75rem] lg:px-[2.5rem] lg:py-[1rem]"
                >
                  <span className="lg:text-base">Sign In</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

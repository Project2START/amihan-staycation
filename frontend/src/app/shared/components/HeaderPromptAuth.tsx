"use client";

import Link from "next/link";
import ImageMainLogo from "./ImageMainLogo";
import { useInView } from "react-intersection-observer";
import { AnimatePresence, motion } from "motion/react";

import { usePathname } from "next/navigation";

function HeaderContent() {
  const pathname = usePathname();
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <ImageMainLogo />

        <div className="flex items-center gap-2 text-xs md:hidden">
          <Link href="/sign-up" className="primary-button-link px-4 py-2.5">
            Sign Up
          </Link>
          <Link
            href="/sign-in"
            className="primary-button-link bg-transparent px-4 py-2.5 text-primary-normal text-shadow-lg"
          >
            Sign In
          </Link>
        </div>

        <div className="hidden md:flex md:items-center md:gap-5 lg:gap-7 xl:gap-9">
          <nav className="flex items-center gap-12 text-sm font-semibold text-secondary-normal lg:text-base">
            <Link
              href="/"
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors xl:text-base ${
                pathname === "/"
                  ? "text-primary-normal"
                  : "hover:bg-primary-normal/10 transition"
              }`}
            >
              Home
            </Link>
            <Link
              href="/units"
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors xl:text-base ${
                pathname.startsWith("/units")
                  ? "text-primary-normal"
                  : "hover:bg-primary-normal/10 transition"
              }`}
            >
              Units
            </Link>
          </nav>
          <div className="border-r-3 border-gray-200 h-12 mx-10"></div>
          <div className="flex items-center text-xs lg:text-sm xl:text-base">
            <Link
              href="/sign-up"
              className="primary-button-link px-5 py-2 lg:px-7 lg:py-3"
            >
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              className="primary-button-link bg-transparent px-5 py-2 text-primary-normal text-shadow-lg lg:px-7 lg:py-3"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

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
        className="bg-white px-4 py-3 shadow-md/30 sm:px-5 md:px-8 md:py-4 lg:px-10 xl:px-14 2xl:px-[4.5rem] min-[1921px]:px-24"
        style={inView ? { visibility: "visible" } : { visibility: "hidden" }}
      >
        <div className="mx-auto w-full max-w-[120rem]">
          <HeaderContent />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!inView && (
          <motion.div
            initial={{ translateY: "-100%" }}
            animate={{ translateY: "0%" }}
            exit={{ translateY: "-100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed top-0 z-999 w-full bg-white px-4 py-3 shadow-md/30 sm:px-5 md:px-8 md:py-4 lg:px-10 xl:px-14 2xl:px-[4.5rem] min-[1921px]:px-24"
          >
            <div className="mx-auto w-full max-w-[120rem]">
              <HeaderContent />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

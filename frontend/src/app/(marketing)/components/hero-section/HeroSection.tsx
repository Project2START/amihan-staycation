import AlternativeSeparator from "@/app/shared/components/AlternativeSeparator";
import SearchUnit from "../../../shared/components/search-unit/SearchUnit";
import HeroTag from "./HeroTag";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

export default function HeroSection() {
  return (
    <section>
      <div className="relative h-[23rem] overflow-hidden rounded-b-[1.75rem] text-white sm:h-[26rem] sm:rounded-b-[2rem] md:h-[25rem] lg:h-[36rem]">
        <Image
          src="/images/amihan-staycation-heroImage.png"
          alt="hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-normal/70 via-secondary-normal/75 to-secondary-normal/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_42%)]" />

        <div className="absolute inset-0 px-4 pb-7 pt-7 sm:px-6 sm:pb-8 sm:pt-9 md:hidden">
          <div className="mx-auto flex h-full w-full max-w-[34rem] flex-col">
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-white/35 bg-white/12 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.19em]">
                AMIHAN STAYCATION
              </span>
              <h1 className="text-3xl font-bold leading-tight text-shadow-lg sm:text-[2.15rem]">
                Your Private Escape
                <br />
                Starts Here
              </h1>
            </div>

            <div className="mt-[1.5rem] rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-wide text-primary-normal">
                Built for family moments
              </p>
              <HeroTag className="mt-1 text-[0.74rem]/6 sm:text-xs/7" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 hidden px-8 py-10 md:block lg:hidden">
          <div className="mx-auto grid h-full w-full max-w-[56rem] grid-cols-12 gap-5">
            <div className="col-span-7 flex flex-col justify-center">
              <span className="mb-3 inline-flex w-fit rounded-full border border-white/30 bg-white/12 px-4 py-1 text-[0.68rem] font-semibold tracking-[0.23em]">
                ESCAPE. RELAX. STAY.
              </span>
              <h1 className="text-balance text-[2.25rem] font-bold leading-[1.15] text-shadow-lg">
                Experience Comfort
                <span className="block text-primary-normal">
                  Like Never Before
                </span>
              </h1>
              <HeroTag className="mt-3 text-sm/8" />
            </div>

            <div className="col-span-5 flex items-center">
              <div className="w-full rounded-2xl border border-white/20 bg-secondary-normal/55 p-5 shadow-xl backdrop-blur-sm">
                <p className="text-sm font-semibold text-primary-normal">
                  Why guests choose us
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/90">
                  <li>Private spaces made for gatherings</li>
                  <li>Seamless booking, fast confirmation</li>
                  <li>Comfort-first amenities in every unit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 hidden px-10 py-12 lg:block xl:px-14 xl:py-16 2xl:px-20 2xl:py-20 min-[1921px]:px-28 min-[1921px]:py-24">
          <div className="mx-auto grid h-full w-full max-w-[78rem] grid-cols-12 gap-8 xl:max-w-[88rem] 2xl:max-w-[98rem] min-[1921px]:max-w-[110rem]">
            <div className="col-span-8 flex flex-col justify-center">
              <span className="mb-5 inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.24em]">
                AMIHAN PREMIUM STAYS
              </span>
              <h1 className="max-w-[18ch] text-[3.2rem] font-bold leading-[1.08] text-shadow-lg xl:text-[3.9rem] 2xl:text-[4.6rem] min-[1921px]:text-[5.2rem]">
                Find Space for What Matters Most
              </h1>
              <HeroTag className="mt-5 max-w-[42rem] text-lg/9 xl:text-xl/10 2xl:text-2xl/11 min-[1921px]:text-[1.95rem]/12" />
            </div>

            <div className="col-span-4 flex items-center justify-end">
              <div className="w-full max-w-[24rem] rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md xl:p-7">
                <p className="text-sm font-semibold tracking-[0.2em] text-primary-normal">
                  FEATURES
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-white/95">
                  <span className="rounded-xl border border-white/15 bg-secondary-normal/45 px-4 py-3">
                    Curated staycation-ready units
                  </span>
                  <span className="rounded-xl border border-white/15 bg-secondary-normal/45 px-4 py-3">
                    Family-first comfort and privacy
                  </span>
                  <span className="rounded-xl border border-white/15 bg-secondary-normal/45 px-4 py-3">
                    Flexible dates and transparent pricing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[34rem] -translate-y-[30%] px-4 sm:max-w-[44rem] sm:-translate-y-[25%] sm:px-6 md:max-w-[56rem] md:px-0 lg:max-w-[72rem] xl:max-w-[82rem] 2xl:max-w-[96rem] min-[1921px]:max-w-[110rem]">
        <Suspense fallback={null}>
          <SearchUnit />
        </Suspense>
        <div className="my-2 flex justify-center md:my-6 lg:my-8">
          <div className="w-full md:w-[62%] lg:w-[52%] xl:w-[46%] 2xl:w-[42%] min-[1921px]:w-[38%]">
            <AlternativeSeparator content="or" />
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href={"/units"}
            className="primary-button-link py-4 text-xs sm:px-14 sm:py-4 md:px-16 md:text-sm hover-animation lg:hover:bg-primary-normal/80 lg:px-28 lg:py-5 lg:text-base xl:px-32 xl:text-lg 2xl:px-40 min-[1921px]:px-48"
          >
            <span>Browse Units</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

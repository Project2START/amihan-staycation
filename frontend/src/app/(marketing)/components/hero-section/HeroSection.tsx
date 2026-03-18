import AlternativeSeparator from "@/app/shared/components/AlternativeSeparator";
import SearchUnit from "../../../shared/components/search-unit/SearchUnit";
import HeroTag from "./HeroTag";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section>
      <div>
        <div className="relative h-[16.5rem] overflow-hidden rounded-b-[1.75rem] text-white sm:h-[18.5rem] sm:rounded-b-[2rem] md:h-[24rem] lg:h-[29rem] xl:h-[34rem] 2xl:h-[34rem] min-[1921px]:h-[46rem]">
          <Image
            src="/images/amihan-staycation-heroImage.png"
            alt="hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-0 h-full w-full bg-secondary-normal/80 px-4 pb-14 pt-14 sm:px-6 sm:pt-16 md:flex md:items-center md:justify-center md:px-8 md:pb-12 md:pt-20 lg:px-10 lg:py-20 xl:px-14 xl:py-24 2xl:px-20 2xl:py-28 min-[1921px]:px-28 min-[1921px]:py-36">
            <div className="w-full md:w-[90%] lg:w-[76%] xl:w-[68%] 2xl:w-[62%] min-[1921px]:w-[58%]">
              <h1 className="text-balance text-3xl font-bold text-shadow-lg leading-tight md:text-[2.15rem] lg:text-[3.2rem] lg:leading-[1.15] xl:text-[3.9rem] 2xl:text-[4.8rem] 2xl:leading-[1.1] min-[1921px]:text-[5.6rem]">
                Experience Comfort{" "}
                <span className="text-primary-normal">Like Never Before</span>
              </h1>
              <HeroTag />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[34rem] -translate-y-[18%] px-4 sm:max-w-[44rem] sm:px-6 md:max-w-[56rem] md:px-0 lg:max-w-[72rem] xl:max-w-[82rem] 2xl:max-w-[96rem] min-[1921px]:max-w-[110rem]">
        <SearchUnit />
        <div className="my-2 flex justify-center md:my-3 lg:my-5 xl:my-6">
          <div className="w-full md:w-[62%] lg:w-[52%] xl:w-[46%] 2xl:w-[42%] min-[1921px]:w-[38%]">
            <AlternativeSeparator content="or" />
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href={"/units"}
            className="primary-button-link py-4 text-sm sm:px-14 sm:py-4 md:px-16 lg:px-28 lg:py-5 lg:text-base xl:px-32 xl:text-lg 2xl:px-40 min-[1921px]:px-48"
          >
            <span>Browse Units</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

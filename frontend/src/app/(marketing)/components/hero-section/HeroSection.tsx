import AlternativeSeparator from "@/app/shared/components/AlternativeSeparator";
import SearchUnit from "../../../shared/components/search-unit/SearchUnit";
import HeroTag from "./HeroTag";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div>
      <div>
        <div className="bg-[url('/images/amihan-staycation-heroImage.png')] bg-cover bg-center relative text-white rounded-b-[2rem] overflow-hidden">
          <div className="w-[100%] h-[100%] bg-secondary-normal/80 px-[1.5rem] pt-[3.5rem] pb-[5rem] md:pb-[3rem] md:pt-[6.5rem] md:flex md:justify-center lg:pt-[6.5rem] lg:pb-[4.5rem]">
            <div className="md:w-[80%] lg:w-[50%]">
              <h1 className="text-lg text-shadow-lg font-bold text-nowrap md:text-2xl lg:text-3xl">
                Experience Comfort{" "}
                <span className="text-primary-normal">Like Never Before</span>
              </h1>
              <HeroTag />
            </div>
          </div>
        </div>
      </div>
      <div className="px-[1.5rem] md:px-0 translate-y-[-20%]">
        <SearchUnit />
        <div className="my-[0.5rem] flex justify-center">
          <div className="md:w-[50%] md:my-[0.5rem] lg:my-[1rem] lg:w-[30%]">
            <AlternativeSeparator content="or" />
          </div>
        </div>
        <div className="flex justify-center">
          <Link
            href={"/units"}
            className="text-xs px-[3rem] py-[0.75rem] bg-primary-normal font-bold rounded-xl text-white hover-animation hover:opacity-80 md:px-[3rem] lg:px-[5rem] lg:py-[1rem]"
          >
            <span>Browse Units</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

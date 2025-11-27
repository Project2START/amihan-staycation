import SearchUnit from "../shared/components/search-unit/SearchUnit";
import HeroTag from "./components/HeroTypeWriter";

export default function HeroSection() {
  return (
    <div>
      <div>
        <div className="bg-[url('/images/amihan-staycation-heroImage.png')] bg-cover bg-center relative text-white rounded-b-[2rem] overflow-hidden">
          <div className="w-[100%] h-[100%] bg-secondary-normal/80 px-[1.5rem] pt-[3.5rem] pb-[5rem] md:pb-[3rem] md:pt-[6.5rem] md:flex md:justify-center lg:pt-[6.5rem] lg:pb-[4.5rem]">
            <div className="md:w-[80%] lg:w-[50%]">
              <h1 className="text-lg font-bold text-nowrap md:text-2xl lg:text-3xl">
                Experience Comfort{" "}
                <span className="text-primary-normal">Like Never Before</span>
              </h1>
              <HeroTag />
            </div>
          </div>
        </div>
      </div>
      <div className="px-[1.5rem]">
        <SearchUnit />
      </div>
    </div>
  );
}

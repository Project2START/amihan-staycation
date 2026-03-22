import { Suspense } from "react";
import HeroSection from "./components/hero-section/HeroSection";
import HeaderPromptAuth from "../shared/components/HeaderPromptAuth";
import ValuePropSection from "./components/value-section/ValuePropSection";
import TestimonialSection from "./components/testimonial-section/TestimonialsSection";
import ExploreUnitsSection from "./components/ExploreUnitsSection";
import ReadyPromptSection from "./components/ReadyPromptSection";
import OwnerMessage from "./components/testimonial-section/OwnerMessage";

export default function HomePage() {
  return (
    <div className="w-full overflow-x-hidden">
      <HeaderPromptAuth />
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>
      <div className="text-secondary-normal">
        <div className="mx-auto w-full max-w-[34rem] px-4 sm:max-w-[44rem] sm:px-6 md:max-w-[56rem] md:px-8 lg:max-w-[72rem] lg:px-10 xl:max-w-[82rem] 2xl:max-w-[96rem] 2xl:px-12 min-[1921px]:max-w-[110rem] min-[1921px]:px-16">
          <ValuePropSection />
          <ExploreUnitsSection />
          <TestimonialSection />
          <OwnerMessage />

          <ReadyPromptSection />
        </div>
      </div>
    </div>
  );
}

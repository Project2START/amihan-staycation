import HeroSection from "./components/hero-section/HeroSection";
import HeaderPromptAuth from "../shared/components/HeaderPromptAuth";
import ValuePropSection from "./components/value-section/ValuePropSection";
import TestimonialSection from "./components/testimonial-section/TestimonialsSection";
import ExploreUnitsSection from "./components/ExploreUnitsSection";
import ReadyPromptSection from "./components/ReadyPromptSection";
import OwnerMessage from "./components/testimonial-section/OwnerMessage";

export default function HomePage() {
  return (
    <div>
      <HeaderPromptAuth />
      <HeroSection />
      <div className="flex flex-cols justify-center text-secondary-normal">
        <div className="px-[1.5rem] md:w-[70%] lg:w-[50%]">
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

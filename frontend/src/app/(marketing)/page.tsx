import HeroSection from "./components/hero-section/HeroSection";
import HeaderPromptAuth from "../shared/components/HeaderPromptAuth";
import ValuePropSection from "./components/value-section/ValuePropSection";
import ReadyPrompt from "./components/ReadyPromptSection";
import TestimonialSection from "./components/testimonial-section/TestimonialsSection";
import ExploreUnitsSection from "./components/ExploreUnitsSection";

export default function Home() {
  return (
    <div>
      <HeaderPromptAuth />
      <HeroSection />
      <div className="flex flex-cols justify-center text-secondary-normal">
        <div className="px-[1.5rem] md:w-[70%] lg:w-[50%]">
          <ValuePropSection />
          <ExploreUnitsSection />
          <TestimonialSection />
          <ReadyPrompt />
        </div>
      </div>
    </div>
  );
}

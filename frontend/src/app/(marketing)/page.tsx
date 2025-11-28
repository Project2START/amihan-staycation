import HeroSection from "./components/hero-section/HeroSection";
import PropmptAuthHeader from "../shared/components/PromptAuthHeader";
import ValuePropSection from "./components/value-section/ValuePropSection";

export default function Home() {
  return (
    <div>
      <PropmptAuthHeader />
      <HeroSection />
      <div className="px-[1.5rem]">
        <ValuePropSection />
      </div>
    </div>
  );
}

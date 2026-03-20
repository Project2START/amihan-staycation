import NavigationBottom from "../components/NavigationBottom";
import Agents from "./components/Agents";

export default function AgentsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="bg-secondary-normal text-white text-center py-[1.5rem] md:py-[1.75rem]">
        <div className="md:max-w-6xl md:mx-auto md:px-6 lg:px-10">
          <h1 className="text-center md:text-left text-xl md:text-2xl font-bold">
            Agent Management
          </h1>
          <p className="text-sm mt-[0.5rem] md:mt-[0.35rem] md:text-left text-white/90">
            Easily manage all your agents here.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-hidden md:bg-slate-50/40">
        <Agents />
      </div>
      <NavigationBottom />
    </div>
  );
}

import NavigationBottom from "../components/NavigationBottom";
import Agents from "./components/Agents";

export default function AgentsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="bg-secondary-normal text-white text-center py-[1.5rem]">
        <h1 className="text-center">Agent Management</h1>
        <p className="text-sm mt-[0.5rem]">
          Easily manage all your agents here.
        </p>
      </div>
      <div className="flex-1 overflow-y-hidden">
        <Agents />
      </div>
      <NavigationBottom />
    </div>
  );
}

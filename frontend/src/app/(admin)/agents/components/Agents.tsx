import AgentsList from "./AgentsList";
import AgentsAddNew from "./AgentsAddNew";

export default function Agents() {
  return (
    <div className="text-secondary-normal p-5 h-full flex flex-col md:max-w-6xl md:mx-auto md:w-full md:px-6 lg:px-10">
      <AgentsList />
      <div className="mt-[0.5rem] md:mt-4">
        <AgentsAddNew />
      </div>
    </div>
  );
}

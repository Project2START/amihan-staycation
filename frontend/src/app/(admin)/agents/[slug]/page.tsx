import AgentView from "./components/AgentView";

export default async function AgentsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      <AgentView agentId={slug} />
    </div>
  );
}

import MyBookingSummary from "./components/MyBookingSummary";

export default async function MyBookingsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <MyBookingSummary bookingId={slug} />
    </div>
  );
}

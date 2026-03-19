import BookingDetails from "./components/BookingDetails";

export default async function BookingSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="flex flex-col h-[calc(100vh-72px)] md:items-center">
      <BookingDetails bookingId={slug} />
    </div>
  );
}

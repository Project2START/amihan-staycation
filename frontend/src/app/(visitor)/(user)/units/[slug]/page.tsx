import UserProduct from "@/app/(visitor)/(user)/components/UserProduct";

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col">
      <UserProduct spaceId={slug} />
    </div>
  );
}

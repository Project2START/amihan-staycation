import SharedReviewsContent from "./components/SharedReviewsContent";

export default async function SharedReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const query = await searchParams;
  const productId = query?.productId ?? null;

  return <SharedReviewsContent productId={productId} />;
}

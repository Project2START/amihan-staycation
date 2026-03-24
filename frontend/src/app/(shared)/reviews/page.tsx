import SharedReviewsContent from "./components/SharedReviewsContent";

export default function SharedReviewsPage({
  searchParams,
}: {
  searchParams: { productId?: string };
}) {
  const productId = searchParams?.productId ?? null;

  return <SharedReviewsContent productId={productId} />;
}

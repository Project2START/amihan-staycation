import SharedReviewsContent from "./components/SharedReviewsContent";

type PageProps = {
  searchParams: Promise<{ productId?: string }>;
};

export default async function SharedReviewsPage({ searchParams }: PageProps) {
  const { productId } = await searchParams;

  return <SharedReviewsContent productId={productId} />;
}

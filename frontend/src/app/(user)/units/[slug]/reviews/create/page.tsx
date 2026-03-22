import CreateReviewForm from "./components/CreateReviewForm";

export default async function CreateReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CreateReviewForm productId={slug} />;
}

import CreateImportedReviewForm from "./components/CreateImportedReviewForm";

export default async function CreateImportedReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CreateImportedReviewForm productId={slug} />;
}

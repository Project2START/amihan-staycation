import EditFormFiller from "./components/EditFormFiller";

export default async function PaymentMethodsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <EditFormFiller slug={slug} />
    </div>
  );
}

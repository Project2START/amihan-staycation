import { Suspense } from "react";
import EditFormFiller from "./components/EditFormFiller";
import EditFormSkeleton from "./components/EditFormSkeleton";

export default async function PaymentMethodsSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <Suspense fallback={<EditFormSkeleton />}>
        <EditFormFiller slug={slug} />
      </Suspense>
    </div>
  );
}

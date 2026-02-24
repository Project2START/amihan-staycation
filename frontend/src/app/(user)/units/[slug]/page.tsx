import { Suspense } from "react";
import Product from "./components/Product";
import { Skeleton } from "@mui/material";

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="px-[1rem] pb-[2rem]">
      <Suspense
        fallback={
          <div className="my-[1rem] grid gap-y-8">
            <div className="flex justify-center">
              <Skeleton
                variant="rounded"
                animation="wave"
                width={60}
                height={30}
              />
            </div>
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="grid gap-y-5" key={i}>
                <Skeleton variant="rounded" animation="wave" height={200} />
                <Skeleton variant="rounded" animation="wave" height={30} />
                <Skeleton variant="rounded" animation="wave" height={60} />
              </div>
            ))}
          </div>
        }
      >
        <Product spaceId={slug} />
      </Suspense>
    </div>
  );
}

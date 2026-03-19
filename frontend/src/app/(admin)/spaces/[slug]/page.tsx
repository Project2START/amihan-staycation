import { Suspense } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import Product from "./components/Product";
import { Skeleton } from "@mui/material";

export default async function SpaceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex flex-col">
      <Suspense
        fallback={
          <div className="my-[1rem] px-[1rem]">
            <div className="grid gap-y-6 md:hidden">
              <div className="flex justify-between">
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={36}
                  height={30}
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={180}
                  height={30}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={80}
                  height={30}
                />
              </div>
              <Skeleton variant="rounded" animation="wave" height={220} />
              <Skeleton variant="rounded" animation="wave" height={190} />
            </div>

            <div className="hidden md:block lg:hidden">
              <div className="mx-auto w-full max-w-[62rem]">
                <div className="rounded-[1.75rem] border border-secondary-normal/10 bg-[#f8fbfa] p-6">
                  <div className="mb-6 space-y-3 border-b border-secondary-normal/10 pb-5">
                    <div className="flex items-center justify-between">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={34}
                        height={30}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        width={260}
                        height={32}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={220}
                        height={32}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={160}
                        height={28}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={130}
                        height={28}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={130}
                        height={28}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      width="100%"
                      height={300}
                    />
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      width="100%"
                      height={230}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="mx-auto w-full max-w-[90rem]">
                <div className="rounded-[2rem] border border-secondary-normal/10 bg-[#f8fbfa] p-8 xl:p-10">
                  <div className="mb-8 border-b border-secondary-normal/10 pb-7">
                    <div className="flex items-center justify-between">
                      <Skeleton
                        variant="text"
                        animation="wave"
                        width={360}
                        height={34}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={300}
                        height={32}
                      />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={160}
                        height={28}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={130}
                        height={28}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={130}
                        height={28}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8 xl:gap-10">
                    <div className="col-span-12 space-y-7 lg:col-span-8">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="100%"
                        height={420}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="100%"
                        height={260}
                      />
                    </div>
                    <div className="col-span-12 lg:col-span-4">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width="100%"
                        height={220}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <Product spaceId={slug} />
      </Suspense>
    </div>
  );
}

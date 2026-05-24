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
          <div className="my-[2rem]">
            <div className="grid gap-y-8 md:hidden">
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

            <div className="hidden md:block lg:hidden">
              <div className="mx-auto w-full max-w-[62rem]">
                <div className="rounded-[1.75rem] border border-secondary-normal/10 bg-[#f8fbfa] p-6">
                  <div className="mb-6 space-y-3 border-b border-secondary-normal/10 pb-5">
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      width={145}
                      height={34}
                    />
                    <Skeleton
                      variant="text"
                      animation="wave"
                      width={430}
                      height={52}
                    />
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
                      height={280}
                    />

                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-7 rounded-2xl border border-secondary-normal/10 bg-white px-6 py-4">
                        <div className="space-y-5">
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="45%"
                            height={24}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="100%"
                            height={30}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="95%"
                            height={30}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="75%"
                            height={30}
                          />
                          <div className="grid grid-cols-3 gap-3 pt-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <Skeleton
                                key={i}
                                variant="rounded"
                                animation="wave"
                                width="100%"
                                height={42}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-5 space-y-3">
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width="100%"
                          height={180}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width="100%"
                          height={88}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="mx-auto w-full max-w-[90rem]">
                <div className="rounded-[2rem] border border-secondary-normal/10 bg-[#f8fbfa] p-8 xl:p-10">
                  <div className="mb-8 flex items-center justify-between gap-6 border-b border-secondary-normal/10 pb-7">
                    <div className="space-y-3">
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        width={140}
                        height={34}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        width={180}
                        height={18}
                      />
                      <Skeleton
                        variant="text"
                        animation="wave"
                        width={420}
                        height={50}
                      />
                    </div>
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      width={330}
                      height={118}
                    />
                  </div>

                  <div className="grid grid-cols-12 gap-8 xl:gap-10">
                    <div className="col-span-12 space-y-7 lg:col-span-7 xl:col-span-8">
                      <div className="rounded-2xl border border-secondary-normal/10 bg-white p-3 xl:p-4">
                        <div className="space-y-3">
                          <Skeleton
                            variant="rounded"
                            animation="wave"
                            width="100%"
                            height={420}
                          />
                          <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Skeleton
                                key={i}
                                variant="rounded"
                                animation="wave"
                                width="100%"
                                height={82}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-secondary-normal/10 bg-white px-7 py-4 xl:px-8 xl:py-5">
                        <div className="space-y-5">
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="45%"
                            height={24}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="100%"
                            height={30}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="100%"
                            height={30}
                          />
                          <Skeleton
                            variant="text"
                            animation="wave"
                            width="80%"
                            height={30}
                          />
                          <div className="grid grid-cols-3 gap-3 pt-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <Skeleton
                                key={i}
                                variant="rounded"
                                animation="wave"
                                width="100%"
                                height={42}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                      <div className="space-y-4">
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width="100%"
                          height={245}
                        />
                        <Skeleton
                          variant="rounded"
                          animation="wave"
                          width="100%"
                          height={105}
                        />
                      </div>
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

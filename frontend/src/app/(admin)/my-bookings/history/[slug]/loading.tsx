import { Skeleton } from "@mui/material";

export default function AdminHistoryLoading() {
  return (
    <div className="h-full flex flex-col text-sm text-secondary-normal">
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col px-0 py-0 lg:px-8 lg:py-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 px-[1rem] py-[1rem] lg:mb-6 lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-6 lg:py-4 lg:shadow-sm">
          <span className="flex-1/3">
            <Skeleton variant="circular" width={24} height={24} />
          </span>
          <Skeleton
            variant="text"
            width={120}
            height={24}
            className="flex-1/3"
          />
          <span className="flex-1/3 flex justify-end">
            <Skeleton variant="text" width={80} height={20} />
          </span>
        </div>

        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="mb-4 hidden rounded-2xl border border-secondary-normal/10 bg-gradient-to-br from-[#f4f7fb] to-white p-4 shadow-sm lg:mb-0 lg:flex lg:flex-col lg:p-5">
            <Skeleton variant="text" width={130} height={16} />
            <Skeleton variant="text" width={150} height={26} className="mt-1" />
            <div className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-secondary-normal/10 bg-white p-3"
                >
                  <Skeleton variant="text" width={100} height={14} />
                  <Skeleton variant="text" width={42} height={30} />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-secondary-normal/10 bg-white p-3 lg:mt-auto">
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="80%" height={16} />
            </div>
          </aside>

          {/* Timeline skeleton - flipped for admin view */}
          <div className="min-w-0 flex min-h-0 flex-col lg:h-full lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:shadow-sm">
            <div className="flex-1 overflow-y-auto px-[1rem] py-[1rem] lg:min-h-0 lg:px-6 lg:py-5">
              <div className="flex flex-col gap-y-6 lg:gap-y-7">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-y-2">
                    {/* Admin message skeleton - right aligned */}
                    {i % 2 !== 0 && (
                      <div className="flex flex-col items-end gap-y-2">
                        <Skeleton variant="text" width={160} height={14} />
                        <div className="max-w-[85%] w-[70%] lg:max-w-[78%]">
                          <Skeleton
                            variant="rounded"
                            height={72}
                            sx={{ borderRadius: "0.75rem" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* User response skeleton - left aligned */}
                    {i % 2 === 0 && (
                      <div className="flex flex-col items-start gap-y-2">
                        <Skeleton variant="text" width={160} height={14} />
                        <div className="max-w-[85%] w-[70%] lg:max-w-[78%]">
                          <Skeleton
                            variant="rounded"
                            height={140}
                            sx={{ borderRadius: "0.75rem" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

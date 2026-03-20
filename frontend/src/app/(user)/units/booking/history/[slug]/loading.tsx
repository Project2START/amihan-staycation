import { Skeleton } from "@mui/material";

export default function HistoryLoading() {
  return (
    <div className="min-h-full text-sm text-secondary-normal">
      <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col px-[1rem] py-[1rem] sm:px-6 lg:h-full lg:px-8 lg:py-8">
        <div className="mb-4 flex items-center justify-between border-b-3 border-secondary-normal/50 px-0 py-0 pb-[1rem] lg:mb-6 lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-6 lg:py-4 lg:shadow-sm">
          <span className="flex-1/3">
            <Skeleton variant="circular" width={24} height={24} />
          </span>
          <span className="flex flex-1/3 justify-center">
            <Skeleton variant="text" width={160} height={28} />
          </span>
          <span className="flex flex-1/3 justify-end">
            <Skeleton variant="text" width={90} height={20} />
          </span>
        </div>

        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="mb-4 hidden rounded-2xl border border-secondary-normal/10 bg-gradient-to-br from-[#f4f7fb] to-white p-4 shadow-sm lg:mb-0 lg:flex lg:flex-col lg:p-5">
            <Skeleton variant="text" width={140} height={16} />
            <Skeleton variant="text" width={180} height={26} />

            <div className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-secondary-normal/10 bg-white p-3"
                >
                  <Skeleton variant="text" width={90} height={12} />
                  <Skeleton variant="text" width={40} height={28} />
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-secondary-normal/10 bg-white p-3 lg:mt-auto">
              <Skeleton variant="text" width="90%" height={14} />
              <Skeleton variant="text" width="65%" height={14} />
            </div>
          </aside>

          <div className="min-w-0 flex min-h-0 flex-col lg:h-full lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:shadow-sm">
            <div className="min-h-0 flex-1 overflow-visible px-0 py-0 sm:px-0 lg:overflow-y-auto lg:px-6 lg:py-5">
              <div className="flex flex-col gap-y-6 lg:gap-y-7">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col gap-y-2">
                    <Skeleton variant="text" width={170} height={14} />

                    <div className="max-w-[90%] lg:max-w-[78%]">
                      <Skeleton
                        variant="rounded"
                        height={86}
                        sx={{ borderRadius: "0.75rem" }}
                      />
                    </div>

                    {i <= 2 && (
                      <div className="w-full self-end max-w-[92%] lg:max-w-[78%]">
                        <Skeleton
                          variant="rounded"
                          height={160}
                          sx={{ borderRadius: "0.75rem" }}
                        />
                      </div>
                    )}

                    {i === 1 && (
                      <div className="mt-2">
                        <Skeleton
                          variant="rounded"
                          height={180}
                          sx={{ borderRadius: "0.75rem" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-secondary-normal/10 px-0 py-[0.75rem] sm:px-0 lg:border-t lg:px-6 lg:py-4">
              <Skeleton
                variant="rounded"
                height={44}
                sx={{ borderRadius: "0.75rem" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

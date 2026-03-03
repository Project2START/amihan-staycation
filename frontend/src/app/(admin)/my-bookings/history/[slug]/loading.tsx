import { Skeleton } from "@mui/material";

export default function AdminHistoryLoading() {
  return (
    <div className="h-full flex flex-col text-sm text-secondary-normal">
      {/* Header skeleton */}
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 px-[1rem] py-[1rem]">
        <span className="flex-1/3">
          <Skeleton variant="circular" width={24} height={24} />
        </span>
        <Skeleton variant="text" width={120} height={24} className="flex-1/3" />
        <span className="flex-1/3 flex justify-end">
          <Skeleton variant="text" width={80} height={20} />
        </span>
      </div>

      {/* Timeline skeleton - flipped for admin view */}
      <div className="flex-1 overflow-y-auto px-[1rem] py-[1rem]">
        <div className="flex flex-col gap-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-y-2">
              {/* Admin message skeleton - right aligned */}
              {i % 2 !== 0 && (
                <div className="flex flex-col items-end gap-y-2">
                  <Skeleton variant="text" width={160} height={14} />
                  <div className="max-w-[85%] w-[70%]">
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
                  <div className="max-w-[85%] w-[70%]">
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
  );
}

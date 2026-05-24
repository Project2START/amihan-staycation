import Skeleton from "@mui/material/Skeleton";

export default function AgentDetailsLoading() {
  return (
    <div className="px-[1rem] py-[1.5rem] md:px-[2rem] md:py-[2rem] lg:px-[3rem] lg:py-[2.5rem] xl:max-w-6xl xl:mx-auto xl:w-full">
      <div className="mb-6 mt-3 md:mb-8 md:mt-4 lg:mb-10 flex items-center justify-between">
        <Skeleton variant="text" width={70} height={30} />
        <Skeleton variant="text" width={140} height={34} />
        <Skeleton variant="text" width={70} height={30} />
      </div>

      <div className="bg-white rounded-xl border-2 border-secondary-normal/30 p-5 md:p-7 lg:p-9">
        <div className="md:grid md:grid-cols-[minmax(0,260px)_1fr] md:gap-8 lg:gap-10">
          <div className="md:border-r md:border-secondary-normal/15 md:pr-6 lg:pr-8">
            <Skeleton variant="circular" width={112} height={112} />
            <div className="mt-4 md:mt-6 grid gap-y-2 md:gap-y-3">
              <Skeleton variant="text" width={180} height={30} />
              <Skeleton variant="text" width={120} height={22} />
            </div>
            <div className="mt-4 hidden md:flex gap-2">
              <Skeleton variant="rounded" width={70} height={26} />
              <Skeleton variant="rounded" width={70} height={26} />
            </div>
          </div>

          <div className="mt-4 space-y-5 md:mt-0 md:space-y-6 grid gap-3 md:grid-cols-2 md:gap-5 lg:gap-6">
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
            <Skeleton variant="rounded" height={70} />
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10 lg:mt-12 grid gap-y-4 md:gap-y-5">
        <Skeleton variant="text" width={180} height={26} />
        <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-5 md:grid-cols-6">
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
          <Skeleton variant="rounded" height={90} />
        </div>
        <Skeleton variant="rounded" height={42} />
        <div className="grid gap-y-3 md:h-[28rem]">
          <Skeleton variant="rounded" height={78} />
          <Skeleton variant="rounded" height={78} />
          <Skeleton variant="rounded" height={78} />
        </div>
      </div>
    </div>
  );
}

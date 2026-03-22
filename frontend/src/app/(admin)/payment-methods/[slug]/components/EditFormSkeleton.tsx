export default function EditFormSkeleton() {
  return (
    <div className="relative text-secondary-normal text-xs px-[1rem] md:px-[1.5rem] lg:px-[2rem] py-[2rem] md:py-[2.5rem] lg:py-[3rem] animate-pulse md:max-w-3xl md:mx-auto">
      {/* Title */}
      <div className="flex justify-center">
        <div className="h-6 md:h-8 lg:h-10 w-48 md:w-64 lg:w-80 bg-gray-200 rounded" />
      </div>

      <div className="mt-[2rem] md:mt-8 lg:mt-10 px-[0.25rem]">
        <div className="md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-6 lg:p-7">
          <div className="hidden md:block mb-5 lg:mb-6 space-y-2">
            <div className="h-4 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-200 rounded" />
          </div>

          <div className="mb-3 flex flex-col md:mb-6 lg:mb-7">
            <div className="h-3 md:h-4 lg:h-5 w-28 md:w-32 lg:w-40 bg-gray-200 rounded" />
            <div className="mt-[0.5rem] md:mt-2 lg:mt-3 h-9 md:h-11 lg:h-12 w-full bg-gray-200 rounded" />
          </div>

          <div className="mb-3 flex flex-col md:mb-6 lg:mb-7">
            <div className="h-3 md:h-4 lg:h-5 w-16 md:w-20 lg:w-24 bg-gray-200 rounded" />
            <div className="mt-[0.5rem] md:mt-2 lg:mt-3 h-24 md:h-32 lg:h-40 w-full bg-gray-200 rounded" />
          </div>

          <div className="hidden md:block mb-4">
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-7">
            <div className="flex flex-col">
              <div className="h-3 md:h-4 lg:h-5 w-24 md:w-28 lg:w-32 bg-gray-200 rounded" />
              <div className="mt-[0.5rem] md:mt-2 lg:mt-3 h-8 md:h-10 lg:h-12 w-full bg-gray-200 rounded-none border-b-2 border-gray-200" />
            </div>

            <div className="flex flex-col mt-[1rem] md:mt-0">
              <div className="h-3 md:h-4 lg:h-5 w-28 md:w-32 lg:w-40 bg-gray-200 rounded" />
              <div className="mt-[0.5rem] md:mt-2 lg:mt-3 h-8 md:h-10 lg:h-12 w-full bg-gray-200 rounded-none border-b-2 border-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-[1.5rem] md:mt-8 lg:mt-10 flex items-center justify-center gap-x-12 md:gap-x-16 lg:gap-x-20">
        <div className="h-10 md:h-11 lg:h-12 w-20 md:w-24 lg:w-28 bg-gray-200 rounded-lg" />
        <div className="h-10 md:h-11 lg:h-12 w-28 md:w-32 lg:w-40 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

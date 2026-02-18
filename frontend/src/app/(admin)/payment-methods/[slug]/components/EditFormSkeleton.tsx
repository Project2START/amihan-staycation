export default function EditFormSkeleton() {
  return (
    <div className="relative text-secondary-normal text-xs px-[1rem] py-[2rem] animate-pulse">
      {/* Title */}
      <div className="flex justify-center">
        <div className="h-6 w-48 bg-gray-200 rounded" />
      </div>

      <div className="mt-[2rem] px-[0.25rem] pb-[1rem]">
        {/* Payment Method */}
        <div className="flex flex-col">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="mt-[0.5rem] h-9 w-full bg-gray-200 rounded" />
        </div>

        {/* QR Code */}
        <div className="flex flex-col mt-[1rem]">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="mt-[0.5rem] h-24 w-full bg-gray-200 rounded" />
        </div>

        {/* Account Name */}
        <div className="flex flex-col mt-[1rem]">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="mt-[0.5rem] h-8 w-full bg-gray-200 rounded-none border-b-2 border-gray-200" />
        </div>

        {/* Account Number */}
        <div className="flex flex-col mt-[1rem]">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="mt-[0.5rem] h-8 w-full bg-gray-200 rounded-none border-b-2 border-gray-200" />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-[1rem] flex items-center justify-center gap-x-12">
        <div className="h-10 w-20 bg-gray-200 rounded-lg" />
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

import NavigationBottom from "../components/NavigationBottom";
import MyBookings from "./components/MyBookings";

export default function MyBookingsPage() {
  return (
    <div className="flex h-[calc(100vh-72px)] flex-col lg:h-full">
      <div className="bg-secondary-normal py-[1.5rem] text-center text-white lg:bg-transparent lg:px-6 lg:pt-6 lg:text-left">
        <div className="lg:mx-auto lg:flex lg:w-full lg:max-w-[1200px] lg:items-center lg:justify-between lg:rounded-2xl lg:bg-secondary-normal lg:px-8 lg:py-7 lg:shadow-sm">
          <div>
            <h1 className="text-center lg:text-left">Booking Management</h1>
            <p className="mt-[0.5rem] text-sm lg:text-base lg:text-white/90">
              All Your Bookings. One Place to Manage Them All.
            </p>
          </div>
          <div className="mt-3 hidden items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] lg:flex">
            <span className="rounded-full bg-white/15 px-3 py-1">
              Status Queue
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              Booking Requests
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              Filtered View
            </span>
          </div>
        </div>
      </div>

      <div className="mt-[1rem] mb-[2rem] flex-1 overflow-y-auto px-[1rem] lg:mx-auto lg:mb-6 lg:mt-5 lg:w-full lg:max-w-[1200px] lg:overflow-visible lg:px-6">
        <div className="lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-6 lg:py-5 lg:mb-[2rem] lg:shadow-sm">
          <MyBookings />
        </div>
      </div>

      <NavigationBottom />
    </div>
  );
}

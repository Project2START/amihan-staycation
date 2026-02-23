import NavigationBottom from "../components/NavigationBottom";
import MyBookings from "./components/MyBookings";

export default function MyBookingsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-72px)]">
      <div className="bg-secondary-normal text-white text-center py-[1.5rem]">
        <h1 className="text-center">Booking Management</h1>
        <p className="text-sm mt-[0.5rem]">
          All Your Bookings. One Place to Manage Them All.
        </p>
      </div>
      <div className="flex-1">
        <MyBookings />
      </div>
      <NavigationBottom />
    </div>
  );
}

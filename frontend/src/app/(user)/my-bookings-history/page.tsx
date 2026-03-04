import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import { notFound } from "next/navigation";
import MyBookingsHistoryList from "./components/MyBookingsHistoryList";
import ClientBackButton from "./components/ClientBackButton";

export interface IUserBooking {
  id: string;
  name: string;
  contact_number: string;
  check_period: {
    check_in: string;
    check_out: string;
  };
  status: string;
  product: {
    name: string;
  };
  createdAt: string;
}

export default async function MyBookingsHistoryPage() {
  const result = await fetchWithAuth("api/bookings/user/all", {
    cache: "no-cache",
    method: "GET",
  });

  if (!result.ok) {
    return notFound();
  }

  const parsed: { message: string; bookings: IUserBooking[] } =
    await result.json();

  return (
    <div className="h-[calc(100vh-72px)] flex flex-col px-[1rem] py-[1.5rem] md:px-[2rem] lg:px-[3rem]">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem] mb-4">
        <span className="flex-1/3 flex items-center">
          <ClientBackButton />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center text-lg font-bold text-secondary-normal">
          My Bookings
        </h1>
        <span className="flex-1/3" />
      </div>
      <MyBookingsHistoryList bookings={parsed.bookings} />
    </div>
  );
}

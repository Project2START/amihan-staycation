import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import { notFound } from "next/navigation";

export default async function MyBookings() {
  const result = await fetchWithAuth("api/bookings/", {
    method: "GET",
    cache: "no-cache",
  });

  // if (!result.ok) {
  //   return notFound();
  // }

  // console.log(result.json());
  return <div></div>;
}

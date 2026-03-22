import { HOST } from "@/app/shared/constants/config";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export function useBookingHistory(id: string) {
  const { data, error, isLoading } = useSWR(
    `${HOST}/api/bookings/${id}/history`,
    fetcher,
  );

  return { isLoading, data, isError: error };
}

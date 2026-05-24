import { HOST } from "@/app/shared/constants/config";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import useSWR from "swr";

const fetcher = (url: string) => axiosWithAuth.get(url).then((res) => res.data);

export function useBookingHistory(id: string) {
  const { data, error, isLoading } = useSWR(
    `${HOST}/api/bookings/${id}/history`,
    fetcher,
  );

  return { isLoading, data, isError: error };
}

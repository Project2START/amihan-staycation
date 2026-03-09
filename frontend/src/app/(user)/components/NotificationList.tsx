"use client";

import { HOST } from "@/app/shared/constants/config";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export default function NotificationList() {
  const { data, error, isLoading } = useSWR(
    `${HOST}/api/notifications?`,
    fetcher,
  );

  if (isLoading) {
    return <p>loading...</p>;
  }

  if (error) {
    return <p>error</p>;
  }

  return <div></div>;
}

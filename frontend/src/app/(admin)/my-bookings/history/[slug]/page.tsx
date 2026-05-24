"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import fetchWithAuthClient from "@/app/shared/lib/fetchWithAuthClient";
import AdminHistory from "./components/AdminHistory";
import AdminHistoryLoading from "./loading";
import NotFoundClient from "@/app/shared/components/NotFoundClient";

export interface IBookingHistory {
  message: string | null;
  action_items: string[];
  id: string;
  createdAt: string;
  valid_id_url: string | null;
  payment_proof_url: string | null;
  hasUserResponded: boolean;
  userName: string;
  ownerName: string;
  bookingId: string;
}

export default function HistorySlugPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [history, setHistory] = useState<IBookingHistory[]>([]);
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchHistory = async () => {
      try {
        const result = await fetchWithAuthClient(
          `api/bookings/${slug}/history`,
          {
            cache: "no-cache",
            method: "GET",
          },
        );

        if (!result.ok) {
          if (mounted) setError(true);
          return;
        }

        const parsed: {
          message: string;
          history: IBookingHistory[];
          bookingStatus: string;
        } = await result.json();

        if (mounted) {
          setHistory(parsed.history);
          setBookingStatus(parsed.bookingStatus);
        }
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <AdminHistoryLoading />;
  }

  if (error) {
    return <NotFoundClient />;
  }

  return (
    <>
      <AdminHistory history={history} bookingStatus={bookingStatus} />
    </>
  );
}

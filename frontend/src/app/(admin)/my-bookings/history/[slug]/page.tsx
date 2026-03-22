import fetchWithAuth from "@/app/shared/lib/fetchWithAuth";
import { notFound } from "next/navigation";
import AdminHistory from "./components/AdminHistory";

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

export default async function HistorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await fetchWithAuth(`api/bookings/${slug}/history`, {
    cache: "no-cache",
    method: "GET",
  });

  if (!result.ok) {
    return notFound();
  }

  const parsed: {
    message: string;
    history: IBookingHistory[];
    bookingStatus: string;
  } = await result.json();

  return (
    <>
      <AdminHistory
        history={parsed.history}
        bookingStatus={parsed.bookingStatus}
      />
    </>
  );
}

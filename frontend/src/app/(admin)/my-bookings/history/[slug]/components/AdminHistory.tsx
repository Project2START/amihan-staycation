"use client";

import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";
import {
  getStatusColor,
  getStatusDisplayName,
  Status,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import { MdAccessTime } from "react-icons/md";

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

const ACTION_ITEM_CONFIG: Record<string, { label: string }> = {
  valid_id: { label: "Valid ID" },
  security_deposit: { label: "Security Deposit Proof" },
};

interface AdminHistoryProps {
  history: IBookingHistory[];
  bookingStatus: string;
}

export default function AdminHistory({
  history,
  bookingStatus,
}: AdminHistoryProps) {
  const router = useRouter();

  const statusDisplayName = getStatusDisplayName(
    (bookingStatus as Status) ?? "pending",
  );
  const statusColor = getStatusColor((bookingStatus as Status) ?? "pending");
  const ownerEntriesCount = history.filter(
    (item) =>
      item.message || (item.action_items && item.action_items.length > 0),
  ).length;
  const userResponsesCount = history.filter(
    (item) =>
      item.hasUserResponded && (item.valid_id_url || item.payment_proof_url),
  ).length;
  const pendingOwnerRequests = history.filter(
    (item) =>
      !item.hasUserResponded &&
      item.action_items &&
      item.action_items.length > 0,
  ).length;

  return (
    <div className="h-full flex flex-col text-sm text-secondary-normal">
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col px-0 py-0 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 px-[1rem] py-[1rem] lg:mb-6 lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-6 lg:py-4 lg:shadow-sm">
          <span className="flex-1/3 flex items-center">
            <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
          </span>
          <h1 className="flex-1/3 text-nowrap text-center font-bold lg:text-xl">
            Booking History
          </h1>
          <span
            className="font-bold flex-1/3 text-right text-xs lg:text-xs lg:uppercase lg:tracking-[0.08em]"
            style={statusColor ? { color: statusColor } : undefined}
          >
            {statusDisplayName}
          </span>
        </div>

        <div className="min-h-0 flex-1 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="mb-4 hidden rounded-2xl border border-secondary-normal/10 bg-gradient-to-br from-[#f4f7fb] to-white p-4 shadow-sm lg:mb-0 lg:flex lg:flex-col lg:p-5">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary-normal/70 lg:text-[0.68rem]">
              Conversation Summary
            </p>
            <h2 className="mt-1 text-base font-semibold lg:text-lg">
              Response Timeline
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-3 lg:mt-5 lg:grid-cols-1">
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                  Total Entries
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {history.length}
                </p>
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                  Your Updates
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {ownerEntriesCount}
                </p>
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                  User Responses
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {userResponsesCount}
                </p>
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                  Pending Requests
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {pendingOwnerRequests}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-secondary-normal/10 bg-white p-3 lg:mt-auto">
              <p className="text-[0.7rem] font-semibold text-secondary-normal/75">
                Keep monitoring this timeline to verify that all requested
                booking documents are submitted by the guest.
              </p>
            </div>
          </aside>

          {/* History Timeline */}
          <div className="min-w-0 flex min-h-0 flex-col lg:h-full lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:shadow-sm">
            <div className="flex-1 overflow-y-auto px-[1rem] py-[1rem] lg:min-h-0 lg:px-6 lg:py-5">
              {history.length === 0 ? (
                <div className="flex items-center justify-center h-full text-secondary-normal/50">
                  <p>No history yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-y-6 lg:gap-y-7">
                  {history.map((item) => {
                    // A "response" entry is one created by the user (has URLs, no message/action_items)
                    const isUserResponse =
                      item.hasUserResponded &&
                      (item.valid_id_url || item.payment_proof_url);

                    // An "owner" entry is one created by the admin (has message or action_items)
                    const isOwnerEntry =
                      item.message ||
                      (item.action_items && item.action_items.length > 0);

                    return (
                      <div key={item.id} className="flex flex-col gap-y-2">
                        {/* Admin (You) message bubble - RIGHT side */}
                        {isOwnerEntry && (
                          <div className="flex items-end flex-col gap-y-2">
                            <div className="flex items-center gap-x-1.5 text-[0.65rem] text-secondary-normal/50">
                              <MdAccessTime />
                              <span>
                                {dayjs(item.createdAt).format(
                                  "MMM DD, YYYY - hh:mm A",
                                )}
                              </span>
                            </div>
                            <div className="bg-[#f0f4f8] rounded-xl rounded-tr-none p-[0.75rem] max-w-[85%] lg:max-w-[78%]">
                              <span className="font-bold text-xs text-primary-normal block mb-[0.25rem]">
                                You
                              </span>
                              {item.message && (
                                <p className="text-xs leading-relaxed lg:text-[0.8rem]">
                                  {item.message}
                                </p>
                              )}
                              {item.action_items &&
                                item.action_items.length > 0 && (
                                  <div className="mt-[0.5rem] text-[0.65rem] text-secondary-normal/60">
                                    <span>Requested: </span>
                                    {item.action_items
                                      .map(
                                        (ai) =>
                                          ACTION_ITEM_CONFIG[ai]?.label ?? ai,
                                      )
                                      .join(", ")}
                                  </div>
                                )}
                            </div>
                          </div>
                        )}

                        {/* User's uploaded responses - LEFT side */}
                        {isUserResponse && (
                          <div className="flex items-start flex-col gap-y-2">
                            <div className="flex items-center gap-x-1.5 text-[0.65rem] text-secondary-normal/50">
                              <MdAccessTime />
                              <span>
                                {dayjs(item.createdAt).format(
                                  "MMM DD, YYYY - hh:mm A",
                                )}
                              </span>
                            </div>
                            <div className="flex flex-col gap-y-3 max-w-[85%] min-w-[60%] lg:max-w-[78%]">
                              <div className="bg-[#e8f5e9] rounded-xl rounded-tl-none p-[0.75rem] border border-green-200">
                                <span className="font-bold text-xs text-green-800 block mb-[0.25rem]">
                                  {item.userName}
                                </span>

                                {item.valid_id_url && (
                                  <div className="flex flex-col gap-y-1 mt-[0.5rem]">
                                    <span className="text-[0.65rem] text-secondary-normal/60">
                                      Valid ID
                                    </span>
                                    <PhotoFullViewDialog
                                      url={item.valid_id_url}
                                    >
                                      <div className="p-[0.25rem] flex justify-center items-center w-full h-[8rem] rounded-lg border-2 border-secondary-normal/20 lg:h-[9rem]">
                                        <div className="w-full relative rounded-lg h-full">
                                          <Image
                                            src={item.valid_id_url}
                                            fill
                                            className="object-contain object-center"
                                            alt="Valid ID submission"
                                            sizes="(min-width: 1024px) 40vw, 80vw"
                                          />
                                        </div>
                                      </div>
                                    </PhotoFullViewDialog>
                                  </div>
                                )}

                                {item.payment_proof_url && (
                                  <div className="flex flex-col gap-y-1 mt-[0.5rem]">
                                    <span className="text-[0.65rem] text-secondary-normal/60">
                                      Security Deposit Proof
                                    </span>
                                    <PhotoFullViewDialog
                                      url={item.payment_proof_url}
                                    >
                                      <div className="p-[0.25rem] flex justify-center items-center w-full h-[8rem] rounded-lg border-2 border-secondary-normal/20 lg:h-[9rem]">
                                        <div className="w-full relative rounded-lg h-full">
                                          <Image
                                            src={item.payment_proof_url}
                                            fill
                                            className="object-contain object-center"
                                            alt="Security deposit submission"
                                            sizes="(min-width: 1024px) 40vw, 80vw"
                                          />
                                        </div>
                                      </div>
                                    </PhotoFullViewDialog>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

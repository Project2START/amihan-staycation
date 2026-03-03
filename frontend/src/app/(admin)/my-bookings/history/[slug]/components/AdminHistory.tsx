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

  return (
    <div className="h-full flex flex-col text-sm text-secondary-normal">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 px-[1rem] py-[1rem]">
        <span className="flex-1/3 flex items-center">
          <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center font-bold">
          Booking History
        </h1>
        <span
          className="font-bold flex-1/3 text-right text-xs"
          style={statusColor ? { color: statusColor } : undefined}
        >
          {statusDisplayName}
        </span>
      </div>

      {/* History Timeline */}
      <div className="flex-1 overflow-y-auto px-[1rem] py-[1rem]">
        {history.length === 0 ? (
          <div className="flex items-center justify-center h-full text-secondary-normal/50">
            <p>No history yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-y-6">
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
                      <div className="bg-[#f0f4f8] rounded-xl rounded-tr-none p-[0.75rem] max-w-[85%]">
                        <span className="font-bold text-xs text-primary-normal block mb-[0.25rem]">
                          You
                        </span>
                        {item.message && (
                          <p className="text-xs leading-relaxed">
                            {item.message}
                          </p>
                        )}
                        {item.action_items && item.action_items.length > 0 && (
                          <div className="mt-[0.5rem] text-[0.65rem] text-secondary-normal/60">
                            <span>Requested: </span>
                            {item.action_items
                              .map((ai) => ACTION_ITEM_CONFIG[ai]?.label ?? ai)
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
                      <div className="flex flex-col gap-y-3 max-w-[85%] min-w-[60%]">
                        <div className="bg-[#e8f5e9] rounded-xl rounded-tl-none p-[0.75rem]">
                          <span className="font-bold text-xs text-green-800 block mb-[0.25rem]">
                            {item.userName}
                          </span>

                          {item.valid_id_url && (
                            <div className="flex flex-col gap-y-1 mt-[0.5rem]">
                              <span className="text-[0.65rem] text-secondary-normal/60">
                                Valid ID
                              </span>
                              <PhotoFullViewDialog url={item.valid_id_url}>
                                <div className="p-[0.25rem] flex justify-center items-center w-full h-[8rem] rounded-lg border-2 border-secondary-normal/20">
                                  <div className="w-full relative rounded-lg h-full">
                                    <Image
                                      src={item.valid_id_url}
                                      fill
                                      className="object-contain object-center"
                                      alt="Valid ID submission"
                                      sizes="100%"
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
                              <PhotoFullViewDialog url={item.payment_proof_url}>
                                <div className="p-[0.25rem] flex justify-center items-center w-full h-[8rem] rounded-lg border-2 border-secondary-normal/20">
                                  <div className="w-full relative rounded-lg h-full">
                                    <Image
                                      src={item.payment_proof_url}
                                      fill
                                      className="object-contain object-center"
                                      alt="Security deposit submission"
                                      sizes="100%"
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
  );
}

"use client";

import { IBookingHistory } from "../page";
import { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { useRouter } from "next/navigation";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";
import HistoryFileUploader from "./HistoryFileUploader";
import { ACTION_ITEM_CONFIG } from "../lib/actionItemConfig";
import {
  getStatusColor,
  getStatusDisplayName,
  Status,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import { MdAccessTime } from "react-icons/md";

interface HistoryProps {
  history: IBookingHistory[];
  bookingStatus: string;
}

export default function History({ history, bookingStatus }: HistoryProps) {
  const router = useRouter();

  const isActionRequired = bookingStatus === "action_required";
  const statusDisplayName = getStatusDisplayName(
    (bookingStatus as Status) ?? "pending",
  );
  const statusColor = getStatusColor((bookingStatus as Status) ?? "pending");

  // All un-responded history items with action_items
  const activeHistoryItems = history.filter(
    (h) => !h.hasUserResponded && h.action_items && h.action_items.length > 0,
  );

  const hasActiveItems = activeHistoryItems.length > 0;

  // File states keyed by `${historyId}__${actionItem}`
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string | null>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileKey = (historyId: string, actionItem: string) =>
    `${historyId}__${actionItem}`;

  const handleSelectFile = (
    historyId: string,
    actionItem: string,
    file: File,
  ) => {
    const key = fileKey(historyId, actionItem);
    const url = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key]!);
      return { ...prev, [key]: url };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleDeleteFile = (historyId: string, actionItem: string) => {
    const key = fileKey(historyId, actionItem);
    if (previews[key]) URL.revokeObjectURL(previews[key]!);
    setFiles((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
    if (!hasActiveItems || !isActionRequired) return;

    setFormError(null);
    const newErrors: Record<string, string> = {};

    // Validate all active history items
    for (const item of activeHistoryItems) {
      for (const actionItem of item.action_items) {
        const config = ACTION_ITEM_CONFIG[actionItem];
        if (!config) continue;

        const key = fileKey(item.id, actionItem);
        if (!files[key]) {
          newErrors[key] = `${config.label} is required`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Submit each active history item
      for (const item of activeHistoryItems) {
        const formData = new FormData();
        formData.append("historyId", item.id);

        for (const actionItem of item.action_items) {
          const key = fileKey(item.id, actionItem);
          if (files[key]) {
            formData.append(actionItem, files[key]!);
          }
        }

        await axios.post(`${HOST}/api/bookings/history/respond`, formData, {
          withCredentials: true,
        });
      }

      CustomToast.show("Response submitted successfully", {
        indicator: "success",
      });

      router.refresh();
    } catch (error) {
      setFormError(errorHandler(error).message);
    } finally {
      setLoading(false);
    }
  };

  // console.log()

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
              const isActive =
                isActionRequired &&
                !item.hasUserResponded &&
                item.action_items &&
                item.action_items.length > 0;

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
                  {/* Date */}
                  <div className="flex items-center gap-x-1.5 text-[0.65rem] text-secondary-normal/50">
                    <MdAccessTime />
                    <span>
                      {dayjs(item.createdAt).format("MMM DD, YYYY - hh:mm A")}
                    </span>
                  </div>

                  {/* Owner message bubble - only for admin-created entries */}
                  {isOwnerEntry && (
                    <div className="bg-[#f0f4f8] rounded-xl rounded-tl-none p-[0.75rem] max-w-[85%]">
                      <span className="font-bold text-xs text-primary-normal block mb-[0.25rem]">
                        {item.ownerName}
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
                  )}

                  {/* User's uploaded responses - only for entries that have actual URLs */}
                  {isUserResponse && (
                    <div className="flex flex-col gap-y-3 self-end max-w-[85%]">
                      <div className="bg-[#e8f5e9] rounded-xl rounded-tr-none p-[0.75rem]">
                        <span className="font-bold text-xs text-green-800 block mb-[0.25rem]">
                          Your Response
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
                  )}

                  {/* Action area: show uploaders for EVERY un-responded item when booking is action_required */}
                  {isActive && (
                    <div className="mt-[0.5rem] border-2 border-dashed border-secondary-normal/20 rounded-xl p-[0.75rem] flex flex-col gap-y-3">
                      <span className="text-xs font-bold">
                        Upload Required Documents
                      </span>

                      {item.action_items.map((actionItem) => {
                        const config = ACTION_ITEM_CONFIG[actionItem];
                        if (!config) return null;

                        const key = fileKey(item.id, actionItem);

                        return (
                          <HistoryFileUploader
                            key={actionItem}
                            label={config.label}
                            file={files[key] ?? null}
                            previewUrl={previews[key] ?? null}
                            onSelect={(file) =>
                              handleSelectFile(item.id, actionItem, file)
                            }
                            onDelete={() =>
                              handleDeleteFile(item.id, actionItem)
                            }
                            error={errors[key]}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit area - only show when there are active history items requiring action */}
      {hasActiveItems && isActionRequired && (
        <div className="px-[1rem] py-[0.75rem] border-t-2 border-secondary-normal/10">
          {formError && (
            <p className="text-center text-[0.65rem] pb-[0.5rem] text-red-900">
              {formError}
            </p>
          )}
          <LoadingOverlay loading={loading}>
            <PrimaryButton
              type="button"
              onClick={handleSubmit}
              disabled={loading}
            >
              <span className="text-xs font-bold">Submit Response</span>
            </PrimaryButton>
          </LoadingOverlay>
        </div>
      )}
    </div>
  );
}

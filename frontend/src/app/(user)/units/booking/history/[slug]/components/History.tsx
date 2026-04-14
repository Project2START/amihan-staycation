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
  const respondedItemsCount = history.filter(
    (item) =>
      item.hasUserResponded && (item.valid_id_url || item.payment_proof_url),
  ).length;
  const ownerEntriesCount = history.filter(
    (item) =>
      item.message || (item.action_items && item.action_items.length > 0),
  ).length;

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

      router.back();
    } catch (error) {
      setFormError(errorHandler(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full text-sm text-secondary-normal">
      <div className="mx-auto flex min-h-full w-full max-w-[1280px] flex-col px-[1rem] py-[1rem] sm:px-6 lg:h-full lg:px-8 lg:py-8">
        <div className="mb-4 flex items-center justify-between border-b-3 border-secondary-normal/50 px-0 py-0 pb-[1rem] lg:mb-6 lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:px-6 lg:py-4 lg:shadow-sm">
          <span className="flex flex-1/3 items-center">
            <PrimaryBackButton onClick={() => router.back()} style="text-xl" />
          </span>
          <h1 className="flex-1/3 text-center text-sm font-bold sm:text-base lg:text-xl">
            Booking History
          </h1>
          <span
            className="flex-1/3 text-right text-[0.7rem] font-bold uppercase tracking-[0.08em] lg:text-xs"
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
                  Owner Updates
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {ownerEntriesCount}
                </p>
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                  Your Responses
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {respondedItemsCount}
                </p>
              </div>
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-3">
                <p className="text-[0.62rem] uppercase tracking-[0.08em] text-secondary-normal/60">
                  Pending Actions
                </p>
                <p className="mt-1 text-lg font-semibold text-secondary-normal">
                  {activeHistoryItems.length}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-secondary-normal/10 bg-white p-3 lg:mt-auto">
              <p className="text-[0.7rem] font-semibold text-secondary-normal/75">
                {hasActiveItems && isActionRequired
                  ? "Upload all requested files before submitting your response."
                  : "No new action is required for this booking right now."}
              </p>
            </div>
          </aside>

          <div className="min-w-0 flex min-h-0 flex-col lg:h-full lg:rounded-2xl lg:border lg:border-secondary-normal/10 lg:bg-white lg:shadow-sm">
            <div className="min-h-0 flex-1 overflow-visible px-0 py-0 sm:px-0 lg:overflow-y-auto lg:px-6 lg:py-5">
              {history.length === 0 ? (
                <div className="flex h-full items-center justify-center text-secondary-normal/50">
                  <p>No history yet</p>
                </div>
              ) : (
                <div className="flex flex-col gap-y-6 lg:gap-y-7">
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
                        {/* Owner message bubble - only for admin-created entries */}
                        {isOwnerEntry && (
                          <div className="flex flex-col items-start gap-y-2">
                            <div className="flex items-center gap-x-1.5 text-[0.65rem] text-secondary-normal/50">
                              <MdAccessTime />
                              <span>
                                {dayjs(item.createdAt).format(
                                  "MMM DD, YYYY - hh:mm A",
                                )}
                              </span>
                            </div>
                            <div className="max-w-[90%] rounded-xl rounded-tl-none border border-secondary-normal/10 bg-[#f0f4f8] p-3 lg:max-w-[78%]">
                              <span className="mb-[0.25rem] block text-xs font-bold text-primary-normal">
                                {item.ownerName}
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

                        {/* User's uploaded responses - only for entries that have actual URLs */}
                        {isUserResponse && (
                          <div className="flex flex-col items-end gap-y-2">
                            <div className="flex items-center gap-x-1.5 text-[0.65rem] text-secondary-normal/50">
                              <MdAccessTime />
                              <span>
                                {dayjs(item.createdAt).format(
                                  "MMM DD, YYYY - hh:mm A",
                                )}
                              </span>
                            </div>
                            <div className="flex min-w-[65%] max-w-[92%] flex-col gap-y-3 lg:max-w-[78%]">
                              <div className="rounded-xl rounded-tr-none border border-green-200 bg-[#e8f5e9] p-3">
                                <span className="mb-[0.25rem] block text-xs font-bold text-green-800">
                                  Your Response
                                </span>

                                {item.valid_id_url && (
                                  <div className="mt-[0.5rem] flex flex-col gap-y-1">
                                    <span className="text-[0.65rem] text-secondary-normal/60">
                                      Valid ID
                                    </span>
                                    <PhotoFullViewDialog
                                      url={item.valid_id_url}
                                    >
                                      <div className="flex h-[8rem] w-full items-center justify-center rounded-lg border-2 border-secondary-normal/20 p-[0.25rem] lg:h-[9rem]">
                                        <div className="relative h-full w-full rounded-lg">
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
                                  <div className="mt-[0.5rem] flex flex-col gap-y-1">
                                    <span className="text-[0.65rem] text-secondary-normal/60">
                                      Security Deposit Proof
                                    </span>
                                    <PhotoFullViewDialog
                                      url={item.payment_proof_url}
                                    >
                                      <div className="flex h-[8rem] w-full items-center justify-center rounded-lg border-2 border-secondary-normal/20 p-[0.25rem] lg:h-[9rem]">
                                        <div className="relative h-full w-full rounded-lg">
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

                        {/* Action area: show uploaders for EVERY un-responded item when booking is action_required */}
                        {isActive && (
                          <div className="mt-[0.5rem] flex flex-col gap-y-3 rounded-xl border-2 border-dashed border-secondary-normal/20 bg-[#f9fbfc] p-3 lg:p-4">
                            <span className="text-xs font-bold lg:text-sm">
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
              <div className="border-t-2 border-secondary-normal/10 px-0 py-[0.75rem] sm:px-0 lg:border-t lg:px-6 lg:py-4">
                {formError && (
                  <p className="pb-[0.5rem] text-center text-[0.65rem] text-red-900">
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
        </div>
      </div>
    </div>
  );
}

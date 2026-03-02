"use client";

import { useState } from "react";
import { STATUS_INFO_ARRAY } from "@/app/(admin)/constants/status_info_array";
import { Select, Checkbox } from "@mantine/core";
import classes from "@/app/shared/cssModules/Select.module.css";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { ABOUT_MAX } from "@/app/shared/constants/productFormValidation";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { CustomToast } from "@/app/shared/ui/CustomToast";

// Checkbox items for action_required status
const ACTION_REQUIRED_ITEMS = [
  { name: "Valid Id", value: "valid_id" },
  { name: "Security deposit", value: "security_deposit" },
];

export default function UpdateBookingStatus({
  bookingStatus,
  bookingId,
  refetch,
}: {
  bookingStatus: string;
  bookingId: string;
  refetch: () => void;
}) {
  const [booking, setBooking] = useState<{
    status: string | null;
    message: string;
    action_items: string[];
  }>({ status: bookingStatus ?? null, message: "", action_items: [] });
  const [error, setError] = useState<string>("");
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  async function handleUpdateBooking() {
    if (booking.message.length > ABOUT_MAX) {
      setError(`Maximum ${ABOUT_MAX} characters allowed.`);
      return;
    }

    setLoadingOverlay(true);

    setError("");

    try {
      await axios.patch(
        `${HOST}/api/bookings/${bookingId}`,
        { ...booking, status_message: booking.message },
        {
          withCredentials: true,
        },
      );
      CustomToast.show("Booking status successfully updated", {
        indicator: "success",
      });
      refetch();
    } catch (err) {
      CustomToast.show("Something went wrong. Please try again later", {
        indicator: "error",
      });
    } finally {
      setLoadingOverlay(false);
    }
  }

  return (
    <div>
      <Select
        withCheckIcon={false}
        allowDeselect={false}
        label="Status"
        value={booking.status}
        onChange={(value) => setBooking((b) => ({ ...b, status: value }))}
        data={STATUS_INFO_ARRAY}
        classNames={{
          wrapper: classes.wrapper,
          input: classes.input,
          option: classes.option,
          label: classes.label,
        }}
        disabled={loadingOverlay}
      />

      <div className="flex flex-col">
        {booking.status === "cancelled" ||
        booking.status === "action_required" ? (
          <>
            {/* Show checkboxes only if status is action_required */}
            {booking.status === "action_required" && (
              <div className="mt-[1rem]">
                <p className="text-xs">Select any corrections or concerns: </p>
                <div className="flex gap-x-5 gap-y-2 mt-4">
                  {ACTION_REQUIRED_ITEMS.map((item) => (
                    <Checkbox
                      disabled={loadingOverlay}
                      color="var(--color-secondary-normal)"
                      size="xs"
                      key={item.value}
                      label={item.name}
                      checked={booking.action_items.includes(item.value)}
                      onChange={(e) => {
                        setBooking((b) => {
                          const checked = e.target.checked;
                          let newItems = checked
                            ? [...b.action_items, item.value]
                            : b.action_items.filter((i) => i !== item.value);
                          return { ...b, action_items: newItems };
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <span className="font-bold mt-[1rem]">Message</span>
            <div className="mt-[0.5rem] h-[7rem]">
              <textarea
                disabled={loadingOverlay}
                onChange={(e) => {
                  setBooking((b) => ({ ...b, message: e.target.value }));
                  if (e.target.value.length > ABOUT_MAX) {
                    setError(`Maximum ${ABOUT_MAX} characters allowed.`);
                  } else {
                    setError("");
                  }
                }}
                value={booking.message}
                id="booking-status-message"
                className="resize-none w-full h-full border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] input-base-focus"
                placeholder="Let the customer know what the status change is about…"
                aria-describedby={error ? "booking-status-message" : undefined}
              ></textarea>
            </div>
            {error && (
              <p
                className="text-red-900 text-[0.65rem] mt-1"
                id="booking-status-message"
              >
                {error}
              </p>
            )}
          </>
        ) : null}
        <div className="mt-[1.5rem]">
          <LoadingOverlay loading={loadingOverlay}>
            <PrimaryButton
              style={{ padding: "0.75rem" }}
              onClick={handleUpdateBooking}
              disabled={
                loadingOverlay
                // || bookingStatus === booking.status ||
                // booking.action_items.length === 0
              }
            >
              <span className="text-xs font-bold">Update</span>
            </PrimaryButton>
          </LoadingOverlay>
        </div>
      </div>
    </div>
  );
}

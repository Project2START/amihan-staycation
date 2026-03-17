"use client";

import { useQuery } from "@apollo/client/react";
import ErrorClient from "@/app/shared/components/ErrorClient";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import dayjs from "dayjs";
import { endTime, startTime } from "@/app/shared/constants/standardStayTime";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaCommentDots } from "react-icons/fa6";
import customParseFormat from "dayjs/plugin/customParseFormat";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import { Skeleton } from "@mui/material";
import {
  GET_BOOKING,
  I_GET_BOOKING,
} from "@/app/(admin)/my-bookings/[slug]/lib/myBookingsSlug-queries";
import {
  getStatusColor,
  getStatusDisplayName,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import SecurityDeposit from "@/app/(admin)/my-bookings/[slug]/components/SecurityDeposit";
import ClampedParagraph from "@/app/shared/components/ClampedParagraph";

dayjs.extend(customParseFormat);

export default function BookingDetails({ bookingId }: { bookingId: string }) {
  const { loading, error, data, refetch } = useQuery<I_GET_BOOKING>(
    GET_BOOKING,
    {
      variables: { id: bookingId },
      fetchPolicy: "network-only",
    },
  );

  const router = useRouter();

  if (loading) {
    return (
      <div className="p-[1.5rem] h-full flex flex-col gap-y-3">
        <Skeleton variant="rounded" height="3.5rem" />
        <Skeleton variant="rounded" className="flex-1" />
        <Skeleton variant="rounded" height="2.5rem" />
      </div>
    );
  }

  if (error || !data?.bookingById)
    return (
      <ErrorClient
        message={errorHandler(error).message}
        onRetry={() => {
          void refetch?.();
        }}
      />
    );

  const booking = data.bookingById;

  const statusDisplayName = getStatusDisplayName(booking.status ?? "pending");
  const statusColor = getStatusColor(booking.status ?? "pending");

  const bookingTextAlternate = "Not define";

  const latestBookingHistory = booking?.history?.[booking?.history.length - 1];

  return (
    <div className="h-full flex flex-col px-[1rem] py-[1.5rem] text-sm text-secondary-normal">
      <div className="flex items-center justify-between border-b-3 border-secondary-normal/50 pb-[1rem]">
        <span className="flex-1/3 flex items-center">
          <PrimaryBackButton
            onClick={() => {
              router.back();
            }}
            style="text-xl"
          />
        </span>
        <h1 className="flex-1/3 text-nowrap text-center">Booking Summary</h1>
        <span
          className="font-bold flex-1/3 text-right text-xs"
          style={statusColor ? { color: statusColor } : undefined}
        >
          {statusDisplayName ?? bookingTextAlternate}
        </span>
      </div>

      {booking.status === "cancelled" && (
        <div
          className="mt-[1rem] text-white rounded-lg p-[0.5rem]"
          style={statusColor ? { backgroundColor: statusColor } : undefined}
        >
          {booking.status_message && booking.status_message.trim() ? (
            <ClampedParagraph
              text={`Your booking has been cancelled due to the following reason: ${booking.status_message}`}
            />
          ) : (
            <ClampedParagraph
              text={
                "Your booking has been cancelled. If you have questions, please contact support."
              }
            />
          )}
        </div>
      )}
      {booking.status === "confirmed" && (
        <div className="mt-[1rem] text-white rounded-lg p-[0.5rem] bg-success-normal">
          <p>
            🎉Congratulations!{" "}
            <strong>Your booking has been successfully confirmed.</strong> You
            may proceed to your unit at your scheduled check-in date and time.
            Enjoy your stay 😊
          </p>
        </div>
      )}

      {latestBookingHistory?.hasUserResponded &&
        booking.status === "pending" && (
          <div className="mt-[1rem] text-white rounded-lg p-[0.5rem] bg-success-normal">
            <p>
              Thank you for responding. Allow us to review your submitted
              information.{" "}
              <Link
                href={`/units/booking/history/${booking.id}`}
                className="underline"
              >
                <span className="font-bold">View History</span>
              </Link>
            </p>
          </div>
        )}

      {!latestBookingHistory?.hasUserResponded &&
        booking.status === "action_required" && (
          <div
            className="mt-[1rem] text-white rounded-lg p-[0.5rem]"
            style={statusColor ? { backgroundColor: statusColor } : undefined}
          >
            <p>
              Some information is required to proceed with your booking. Click{" "}
              <Link
                href={`/units/booking/history/${booking.id}`}
                className="underline font-bold"
              >
                <span>here</span>
              </Link>{" "}
              to continue.
            </p>
          </div>
        )}

      {booking.status === "checked_out" && (
        <Link href={`/units/${booking.product?.id}/reviews/create`}>
          <button className="w-full mt-[1rem] py-2 px-4 text-white bg-primary-normal rounded-lg hover:opacity-85 transition flex items-center justify-center gap-2 font-semibold">
            <FaCommentDots size={16} />
            Write a Review
          </button>
        </Link>
      )}

      <div className="flex-1 overflow-auto grid gap-y-3 px-[0.5rem]">
        <div className="flex justify-between items-center mt-[1.5rem] text-xs text-gray-500">
          <span>Request date</span>

          <span>
            {dayjs(booking?.createdAt).format("MMMM, DD, YYYY, hh:mm A")}{" "}
          </span>
        </div>
        <div className="flex justify-between items-center mt-[0.5rem]">
          <span>Unit</span>
          <Link
            href={`/units/${booking.product?.id ?? bookingTextAlternate}`}
            className="font-bold underline"
          >
            <span>{booking?.product?.name ?? bookingTextAlternate}</span>
          </Link>
        </div>
        <div className="flex justify-between items-center">
          <span>Check-in</span>
          <span className="font-bold">
            {dayjs(booking?.check_period?.check_in).format("dddd, MMM DD,")}{" "}
            {dayjs(startTime, "HH:mm").format("hh:mm A")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Check-out</span>
          <span className="font-bold">
            {dayjs(booking?.check_period?.check_out).format("dddd, MMM DD,")}{" "}
            {dayjs(endTime, "HH:mm").format("hh:mm A")}
          </span>
        </div>
        <div className="my-[1rem] pt-[1rem] grid gap-y-3 border-t-1 border-secondary-normal/20">
          <h2>Primary Guest</h2>
          <div className="flex justify-between items-center">
            <span>Name</span>
            <span className="font-bold">
              {booking.name ?? bookingTextAlternate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Age</span>
            <span className="font-bold">
              {booking.age ?? bookingTextAlternate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Nationality</span>
            <span className="font-bold">
              {booking.nationality ?? bookingTextAlternate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Contact Number</span>
            <span className="font-bold">
              {booking.contact_number ?? bookingTextAlternate}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>With Vehicle</span>
            <span className="font-bold">
              {booking.with_vehicle ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span>Pool Access</span>
            <div>
              {booking?.pool_access?.access?.length !== 0 ? (
                <ul className="font-bold text-right flex flex-col gap-y-2 max-h-[5rem] border-b-2 border-secondary-normal/30 overflow-y-auto pb-[0.5rem]">
                  {booking?.pool_access?.access?.map((a) => {
                    if (!a.am && !a.pm) return;
                    return (
                      <li key={a.date}>
                        {dayjs(a.date).format("MMM DD")} -{" "}
                        {a.am && a.pm
                          ? "AM/PM"
                          : a.am
                            ? "AM"
                            : a.pm
                              ? "PM"
                              : null}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "None"
              )}
            </div>
          </div>
          {booking?.image_valid_id_url ? (
            <div className="flex flex-col gap-y-2">
              <span>Valid ID</span>
              <div>
                <PhotoFullViewDialog url={booking.image_valid_id_url}>
                  <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
                    <div className="w-full relative rounded-lg h-full">
                      <Image
                        src={booking.image_valid_id_url}
                        fill
                        className="object-contain object-center"
                        alt="Amihan Staycaion file upload image for booking"
                        sizes="100%"
                      />
                    </div>
                  </div>
                </PhotoFullViewDialog>
              </div>
            </div>
          ) : (
            <div className="flex justify-between gap-y-2">
              <span>Valid ID</span>
              <div>None</div>
            </div>
          )}

          {booking?.image_payment_proof_url ? (
            <SecurityDeposit
              account_name={booking.paymentMethod?.account_name ?? ""}
              account_number={booking.paymentMethod?.account_number ?? ""}
              image_from_url={booking.image_payment_proof_url ?? undefined}
              image_to_url={booking.paymentMethod?.image_url ?? undefined}
              payment_method={booking?.paymentMethod?.payment_method ?? ""}
              id={booking?.paymentMethod?.id ?? ""}
            />
          ) : (
            <div className="flex justify-between gap-y-2">
              <span>Security Deposit</span>
              <div>None</div>
            </div>
          )}
        </div>

        {!booking.additional_guests ||
        booking.additional_guests.length === 0 ? null : (
          <div className="flex flex-col gap-y-3 bg-[#efefef] rounded-lg p-[1rem]">
            <h2 className="font-bold">Additional Guests</h2>
            <div className="flex flex-col gap-y-3">
              {booking.additional_guests.map((additional_guest, index, arr) => {
                if (!additional_guest) return;

                const {
                  name,
                  age,
                  with_vehicle,
                  pool_access,
                  image_valid_id_url,
                  below_three_feet,
                } = additional_guest;

                return (
                  <div
                    key={uuid()}
                    className={`flex flex-col gap-y-3 pb-[1.5rem] ${arr.length - 1 !== index && "border-b-5 border-secondary-normal/30"}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Name</span>
                      <div className="font-bold">
                        {name ? name : bookingTextAlternate}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Age</span>
                      <div className="font-bold">
                        {age ? age : bookingTextAlternate}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Below 3 Feet</span>
                      <div className="font-bold">
                        {below_three_feet ? "Yes" : "No"}
                      </div>
                    </div>
                    {below_three_feet ? null : (
                      <>
                        <div className="flex justify-between items-center">
                          <span>With Vehicle</span>
                          <div className="font-bold">
                            {with_vehicle ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="flex justify-between items-start">
                          <span>Pool Access</span>
                          <div>
                            {pool_access?.access?.length !== 0 ? (
                              <ul className="font-bold text-right flex flex-col gap-y-2 max-h-[5rem] border-b-2 border-secondary-normal/30 overflow-y-auto pb-[0.5rem]">
                                {pool_access?.access?.map((a) => {
                                  if (!a.am && !a.pm) return;
                                  return (
                                    <li key={a.date}>
                                      {dayjs(a.date).format("MMM DD")} -{" "}
                                      {a.am && a.pm
                                        ? "AM/PM"
                                        : a.am
                                          ? "AM"
                                          : a.pm
                                            ? "PM"
                                            : null}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              "None"
                            )}
                          </div>
                        </div>
                        {image_valid_id_url ? (
                          <div className="flex flex-col gap-y-2">
                            <span>Valid ID</span>
                            <div>
                              <PhotoFullViewDialog url={image_valid_id_url}>
                                <div className="p-[0.5rem] flex justify-center items-center w-full h-[10rem] rounded-lg border-2 border-secondary-normal/30">
                                  <div className="w-full relative rounded-lg h-full">
                                    <Image
                                      src={image_valid_id_url}
                                      fill
                                      className="object-contain object-center"
                                      alt="Amihan Staycaion file upload image for booking"
                                      sizes="100%"
                                    />
                                  </div>
                                </div>
                              </PhotoFullViewDialog>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between gap-y-2">
                            <span>Valid ID</span>
                            <div>None</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

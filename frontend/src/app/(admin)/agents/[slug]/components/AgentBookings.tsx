"use client";

import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import Skeleton from "@mui/material/Skeleton";
import Link from "next/link";
import dayjs from "dayjs";
import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  MdPendingActions,
  MdCheckCircle,
  MdLogout,
  MdLogin,
  MdWarning,
  MdTimerOff,
  MdCancel,
} from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import {
  getStatusColor,
  getStatusDisplayName,
  Status,
} from "@/app/(admin)/my-bookings/lib/getStatusInfo";
import ErrorClient from "@/app/shared/components/ErrorClient";
import { errorHandler } from "@/app/shared/lib/errorHandler";

const GET_BOOKINGS_BY_AGENT = gql`
  query GetBookingsByAgent($agentId: String!) {
    bookingsByAgent(agentId: $agentId) {
      id
      name
      contact_number
      check_period {
        check_in
        check_out
      }
      status
      product {
        name
      }
    }
  }
`;

interface AgentBooking {
  id: string | null;
  name: string | null;
  contact_number: string | null;
  check_period: {
    check_in: string | null;
    check_out: string | null;
  };
  status: Status;
  product: {
    name: string | null;
  };
}

interface I_GET_BOOKINGS_BY_AGENT {
  bookingsByAgent: AgentBooking[];
}

type FilterStatus = Status | "all";

const statuses: { name: string; status: FilterStatus }[] = [
  { name: "All", status: "all" },
  { name: "Pending", status: "pending" },
  { name: "Confirmed", status: "confirmed" },
  { name: "Checked-In", status: "checked_in" },
  { name: "Checked-Out", status: "checked_out" },
  { name: "Action Required", status: "action_required" },
  { name: "Expired", status: "expired" },
  { name: "Cancelled", status: "cancelled" },
];

const statusIcons: Record<Status, React.ReactNode> = {
  pending: <MdPendingActions className="text-lg" />,
  confirmed: <MdCheckCircle className="text-lg" />,
  checked_in: <MdLogin className="text-lg" />,
  checked_out: <MdLogout className="text-lg" />,
  action_required: <MdWarning className="text-lg" />,
  expired: <MdTimerOff className="text-lg" />,
  cancelled: <MdCancel className="text-lg" />,
};

export default function AgentBookings({ agentId }: { agentId: string }) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const { loading, error, data, refetch } = useQuery<I_GET_BOOKINGS_BY_AGENT>(
    GET_BOOKINGS_BY_AGENT,
    { variables: { agentId }, fetchPolicy: "network-only" },
  );

  if (loading)
    return (
      <div className="mt-8 grid gap-y-5">
        <Skeleton variant="rounded" height={90} />
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="rounded" height={70} />
        <Skeleton variant="rounded" height={70} />
      </div>
    );

  if (error || !data)
    return (
      <div className="mt-8">
        <ErrorClient
          message={errorHandler(error).message}
          onRetry={() => {
            void refetch?.();
          }}
        />
      </div>
    );

  const allBookings = data.bookingsByAgent ?? [];

  const counts: Record<string, number> = { all: allBookings.length };
  allBookings.forEach((b: AgentBooking) => {
    const st = b?.status ?? "pending";
    counts[st] = (counts[st] ?? 0) + 1;
  });

  const filteredBookings =
    filterStatus === "all"
      ? allBookings
      : allBookings.filter(
          (b: AgentBooking) => (b?.status ?? "pending") === filterStatus,
        );

  const summaryCards: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      label: "Total",
      value: allBookings.length,
      icon: <HiClipboardDocumentList className="text-xl" />,
      color: "#3B82F6",
    },
    {
      label: "Pending",
      value: counts["pending"] ?? 0,
      icon: statusIcons.pending,
      color: getStatusColor("pending"),
    },
    {
      label: "Confirmed",
      value: counts["confirmed"] ?? 0,
      icon: statusIcons.confirmed,
      color: getStatusColor("confirmed"),
    },
    {
      label: "Checked-In",
      value: counts["checked_in"] ?? 0,
      icon: statusIcons.checked_in,
      color: getStatusColor("checked_in"),
    },
    {
      label: "Action Req.",
      value: counts["action_required"] ?? 0,
      icon: statusIcons.action_required,
      color: getStatusColor("action_required"),
    },
    {
      label: "Cancelled",
      value: counts["cancelled"] ?? 0,
      icon: statusIcons.cancelled,
      color: getStatusColor("cancelled"),
    },
  ];

  return (
    <div className="mt-8 mb-12">
      {/* Title */}
      <h2 className="text-base font-bold text-secondary-normal">
        Agent&apos;s Bookings
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-3 flex flex-col items-center gap-y-1"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full"
              style={{ backgroundColor: card.color + "1A", color: card.color }}
            >
              {card.icon}
            </div>
            <span className="text-lg font-bold text-secondary-normal">
              {card.value}
            </span>
            <span className="text-[0.65rem] text-gray-500 font-medium text-center">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="mt-6">
        <ul className="flex items-center gap-x-3 text-sm overflow-x-auto py-2 mb-3">
          {statuses.map((s) => {
            const statusCount = counts[s.status] ?? 0;

            return (
              <li key={s.status}>
                <button
                  onClick={() => setFilterStatus(s.status)}
                  className="text-nowrap flex items-center px-3 py-1 rounded-lg border-2 border-secondary-normal/30 gap-x-1"
                  style={
                    s.status === filterStatus
                      ? {
                          backgroundColor: "var(--color-secondary-normal)",
                          color: "white",
                        }
                      : undefined
                  }
                >
                  <span>{s.name}</span>
                  {statusCount === 0 ? null : (
                    <div className="px-[0.5rem] min-w-[1.25rem] max-w-[2.5rem] rounded-full bg-primary-normal">
                      <span className="text-white font-bold text-[0.65rem] text-center">
                        {statusCount > 99 ? "99+" : statusCount}
                      </span>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Refresh */}
      <div className="flex items-center justify-end mb-4">
        <button
          type="button"
          onClick={() => refetch()}
          className="text-secondary-normal text-xs flex items-center bg-white border border-gray-300 rounded-lg px-2 py-1 font-bold text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="text-xs mr-2">
            <FiRefreshCw />
          </span>
          <span className="text-xs">Refresh</span>
        </button>
      </div>

      {/* Bookings List */}
      <div className="flex flex-col gap-y-5">
        {filteredBookings.length === 0 ? (
          <div className="flex justify-center items-center font-bold text-center text-gray-300 py-8">
            <span>
              {filterStatus === "all"
                ? "No bookings available."
                : `No ${filterStatus.replace("_", " ")} bookings.`}
            </span>
          </div>
        ) : (
          filteredBookings.filter(Boolean).map((b: AgentBooking) => {
            const check_in = b?.check_period?.check_in ?? "";
            const check_out = b?.check_period?.check_out ?? "";
            const contact_number = b?.contact_number ?? "";
            const name = b?.name ?? "Unknown";
            const product_name = b?.product?.name ?? "—";
            const status = (b?.status ?? "pending") as Status;
            const id = b?.id ?? `${name}-${check_in}`;
            const colorStatus = getStatusColor(status);
            const displayNameStatus = getStatusDisplayName(status);

            return (
              <div key={id}>
                <Link href={`/my-bookings/${id}`}>
                  <div
                    className="relative text-xs text-secondary-normal rounded-lg p-3 border-l-2 border-r-2 border-b-2 border-gray-300"
                    style={{ borderTop: `3.5px solid ${colorStatus}` }}
                  >
                    <div
                      className="absolute top-0 right-0 rounded-bl-4xl p-[0.35rem] pl-[1rem] text-white"
                      style={{ backgroundColor: colorStatus }}
                    >
                      <span className="capitalize font-bold">
                        {displayNameStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-bold">{name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-[0.25rem]">
                      <div>
                        <span>{contact_number}</span>
                      </div>
                      <div>
                        <span className="font-bold">{product_name}</span>
                        <span className="mx-[0.5rem]">/</span>
                        <span>{dayjs(check_in).format("MMMM DD")}</span>
                        <span className="mx-[0.25rem]">-</span>
                        <span>{dayjs(check_out).format("DD")}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

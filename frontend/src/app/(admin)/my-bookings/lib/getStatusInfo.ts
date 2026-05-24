const STATUS_INFO = {
  pending: { color: "#BA9B38", displayName: "Pending" },
  confirmed: { color: "#64BE73", displayName: "Confirmed" },
  checked_out: { color: "#808080", displayName: "Checked-out" },
  checked_in: { color: "#0B5173", displayName: "Checked-in" },
  action_required: { color: "#eda074", displayName: "Action required" },
  expired: { color: "#808080", displayName: "Expired" },
  cancelled: { color: "#808080", displayName: "Cancelled" },
} as const;

export type Status = keyof typeof STATUS_INFO;

export function getStatusColor(status: Status): string {
  return STATUS_INFO[status].color;
}

export function getStatusDisplayName(status: Status): string {
  return STATUS_INFO[status].displayName;
}

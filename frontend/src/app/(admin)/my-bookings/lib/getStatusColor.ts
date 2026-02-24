const STATUS_COLOR = {
  pending: "#BA9B38",
  confirmed: "#64BE73",
  checked_out: "#808080",
  checked_in: "#0B5173",
  action_required: "#B86B3E",
  expired: "#808080",
  cancelled: "#808080",
} as const;

export type Status = keyof typeof STATUS_COLOR;

export function getStatusColor(status: Status): string {
  return STATUS_COLOR[status];
}

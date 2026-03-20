import { LuCalendarDays } from "react-icons/lu";
import { BsHouseDoor } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { MdPayment, MdPerson3 } from "react-icons/md";
import type { IconType } from "react-icons";

export interface AdminNavItem {
  path: string;
  name: string;
  id: string;
  icon: IconType;
}

export const adminNavItems: AdminNavItem[] = [
  {
    path: "/my-bookings",
    name: "Bookings",
    id: "bookings-1",
    icon: LuCalendarDays,
  },
  {
    path: "/spaces",
    name: "Spaces",
    id: "spaces-1",
    icon: BsHouseDoor,
  },
  {
    path: "/insights",
    name: "Insights",
    id: "insights-1",
    icon: GoGraph,
  },
  {
    path: "/agents",
    name: "Agents",
    id: "agents-1",
    icon: MdPerson3,
  },
  {
    path: "/payment-methods",
    name: "Payment Methods",
    id: "payment-methods-1",
    icon: MdPayment,
  },
];

"use client";

import { LuCalendarDays } from "react-icons/lu";
import { BsHouseDoor } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { MdPerson3 } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navList = [
  {
    path: "/my-bookings",
    name: "Bookings",
    id: "bookings-1",
    icon: <LuCalendarDays />,
  },

  { path: "/spaces", name: "Spaces", id: "spaces-1", icon: <BsHouseDoor /> },

  { path: "/insights", name: "Insights", id: "insights-1", icon: <GoGraph /> },

  { path: "/agents", name: "Agents", id: "agents-1", icon: <MdPerson3 /> },
];

export default function NavigationBottom() {
  const pathname = usePathname();

  return (
    <div className="w-full z-99">
      <nav className="relative px-[1.5rem] py-[0.75rem] text-gray-500 bg-white shadow-[0_0_15px]">
        <ul className="flex items-center justify-between">
          {navList.map((list) => {
            const isActive = pathname === list.path;

            return (
              <li key={list.id}>
                <Link href={list.path}>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-xl"
                      style={
                        isActive
                          ? {
                              color: "var(--color-secondary-normal)",
                            }
                          : { color: "inherit" }
                      }
                    >
                      {list.icon}
                    </span>
                    <span
                      className="text-xs mt-[0.5rem]"
                      style={
                        isActive
                          ? {
                              color: "var(--color-secondary-normal)",
                              fontWeight: "bold",
                            }
                          : { color: "inherit" }
                      }
                    >
                      {list.name}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

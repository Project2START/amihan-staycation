"use client";

import { LuCalendarDays } from "react-icons/lu";
import { BsHouseDoor } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { MdPerson3 } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import NewUnitForm from "@/app/(admin)/spaces/components/NewUnitForm";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";

const navList = [
  {
    path: "/bookings",
    name: "Bookings",
    id: "bookings-1",
    icon: <LuCalendarDays />,
  },

  { path: "/spaces", name: "Spaces", id: "spaces-1", icon: <BsHouseDoor /> },

  { path: "/insights", name: "Insights", id: "insights-1", icon: <GoGraph /> },

  { path: "/agents", name: "Agents", id: "agents-1", icon: <MdPerson3 /> },
];

export default function NavigationBottomSpaces() {
  const [addNew, setAddNew] = useState<boolean>(false);

  const pathname = usePathname();
  
  // Check if on Spaces page
  const isOnSpacesPage = pathname === "/spaces";

  return (
    <div className="fixed bottom-0 left-0 w-full z-999">
      <nav className="relative px-[1.5rem] py-[0.75rem] text-gray-500 bg-white shadow-[0_0_15px]">
        <ul className="flex items-center justify-between">
          {/* Plus Button - Only visible on Spaces page */}
          {isOnSpacesPage && (
            <li className="absolute left-[50%] translate-x-[-42.5%] translate-y-[-50%] top-0">
              <button
                onClick={() => setAddNew(true)}
                className="bg-primary-normal border-5 border-white shadow-[0_-2.5px_5px] rounded-full p-[0.75rem] transition-transform hover:scale-110"
              >
                <span className="text-white text-base">
                  <FaPlus />
                </span>
              </button>
            </li>
          )}

          {/* Dialog - Only renders when on Spaces page and addNew is true */}
          {isOnSpacesPage && (
            <li className="absolute">
              <DialogBaseContent
                onCloseDialog={() => setAddNew(false)}
                openDialog={addNew}
                enableClickOutside={false}
                scrollVertically={false}
              >
                <NewUnitForm onCloseDialog={() => setAddNew(false)} />
              </DialogBaseContent>
            </li>
          )}

          {navList.map((list) => {
            const isActive = pathname === list.path;

            return (
              <li key={list.id}>
                <Link href={list.path}>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-xl transition-colors"
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
                      className="text-xs mt-[0.5rem] transition-colors"
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
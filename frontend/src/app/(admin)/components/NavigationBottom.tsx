"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "./adminNavItems";

export const navList = adminNavItems;

export default function NavigationBottom() {
  const pathname = usePathname();
  const mobileNavItems = navList.filter(
    (item) => item.path !== "/payment-methods",
  );

  return (
    <div className="w-full z-99 lg:hidden">
      <nav className="relative px-[1.5rem] py-[0.75rem] text-gray-500 bg-white shadow-[0_0_15px]">
        <ul className="flex items-center justify-between">
          {mobileNavItems.map((list) => {
            const isActive = pathname === list.path;
            const Icon = list.icon;

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
                      <Icon />
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

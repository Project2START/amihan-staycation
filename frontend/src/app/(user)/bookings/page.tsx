import React from "react";
import HeaderAdmin from "@/app/(admin)/components/HeaderAdmin";
import NavigationBottomAdmin from "@/app/(admin)/spaces/components/NavigationBottomSpaces";
import SpacesHeaderBanner from "./components/SpacesHeaderBanner";

export default function BookingsPage() {
  return (
    <div className="flex flex-col">
      <HeaderAdmin />
      <SpacesHeaderBanner />
      <NavigationBottomAdmin />
    </div>
  );
}

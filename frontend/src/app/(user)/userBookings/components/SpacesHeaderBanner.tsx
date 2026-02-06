import React from "react";

export default function SpacesHeaderBanner() {
  return (
    <div className="bg-secondary-normal px-6 py-4 md:py-20 lg:py-24">
      <div className="flex flex-col items-center justify-center text-center gap-1">
        <h1 className="text-xl font-bold text-white md:text-4xl lg:text-5xl">
          Your Staycation Spaces
        </h1>
        <p className="text-xs text-white md:text-lg lg:text-xl">
          Manage your perfect getaways in one place.
        </p>
      </div>
    </div>
  );
}

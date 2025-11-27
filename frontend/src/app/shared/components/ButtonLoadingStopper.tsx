"use client";

import React from "react";
import { CircularProgress } from "@mui/material";

export default function ButtonLoadingStopper({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div className="relative">
      {children}
      {loading && (
        <span className="text-gray-500 absolute top-[50%] translate-x-[50%] translate-y-[-50%] right-[50%] ">
          <CircularProgress color="inherit" size={18} />
        </span>
      )}
    </div>
  );
}

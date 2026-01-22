"use client";
import React, { useRef, useEffect } from "react";

export default function Focuser({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      tabIndex={-1} // allow programmatic focus
    >
      {children}
    </div>
  );
}

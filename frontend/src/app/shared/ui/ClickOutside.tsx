"use client";

import React, { useEffect, useRef } from "react";

interface ClickOutsideProps {
  onClickOutside: () => void;
  children: React.ReactNode;
}

const ClickOutside: React.FC<ClickOutsideProps> = ({
  onClickOutside,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDownOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;

      // Ignore events from detached nodes during rerenders/unmounts.
      if (!target || !(target as HTMLElement).isConnected) return;

      if (ref.current && !ref.current.contains(target)) {
        onClickOutside();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickOutside();
      }
    };

    // Close only on pointer down outside to avoid close-on-rerender issues.
    document.addEventListener("mousedown", handlePointerDownOutside);

    // Escape key
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} className="w-[100%] h-[100%]">
      {children}
    </div>
  );
};

export default ClickOutside;

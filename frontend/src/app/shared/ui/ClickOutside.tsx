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
    const handleClickOrFocus = (event: MouseEvent | FocusEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClickOutside();
      }
    };

    // Mouse events
    document.addEventListener("mousedown", handleClickOrFocus);
    document.addEventListener("click", handleClickOrFocus); // handles Enter/Space keyboard activation

    // Keyboard focus events
    document.addEventListener("focusin", handleClickOrFocus);

    // Escape key
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOrFocus);
      document.removeEventListener("click", handleClickOrFocus);
      document.removeEventListener("focusin", handleClickOrFocus);
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

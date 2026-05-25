"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SearchUnit = dynamic(
  () => import("@/app/shared/components/search-unit/SearchUnit"),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function HeroSearchUnit() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const show = () => {
      if (!cancelled) setReady(true);
    };

    if (typeof window !== "undefined") {
      const idleCallback = (
        window as Window & {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
          cancelIdleCallback?: (id: number) => void;
        }
      ).requestIdleCallback;

      if (idleCallback) {
        const id = idleCallback(show, { timeout: 300 });
        return () => {
          cancelled = true;
          (
            window as Window & { cancelIdleCallback?: (id: number) => void }
          ).cancelIdleCallback?.(id);
        };
      }

      const timer = window.setTimeout(show, 150);
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return <div className="min-h-[7.5rem]">{ready ? <SearchUnit /> : null}</div>;
}

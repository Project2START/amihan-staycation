"use client";

import { useEffect, useRef, useState } from "react";

export default function ClampedParagraph({ text }: { text: string }) {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;

    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <div>
      <p ref={pRef} className="line-clamp-7 text-justify">
        {text}
      </p>

      {isClamped && (
        <div className="flex justify-end">
          <button className="mt-1 text-secondary-normal italic underline">
            Read more
          </button>
        </div>
      )}
    </div>
  );
}

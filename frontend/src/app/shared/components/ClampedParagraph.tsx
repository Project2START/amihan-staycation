"use client";

import { useEffect, useRef, useState } from "react";

const ClampedParagraph = ({ text }: { text: string }) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = pRef.current;
    if (!el) return;
    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [text]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <p ref={pRef} className={expanded ? undefined : "line-clamp-7"}>
        {text}
      </p>

      {isClamped && (
        <div className="flex justify-end">
          <button
            className="mt-1 text-secondary-normal italic underline"
            onClick={handleToggle}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ClampedParagraph;

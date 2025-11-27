import React from "react";

export default function AlternativeSeparator({
  content = "or continue with",
  lineColor = "text-primary-normal",
}: {
  content?: React.ReactNode;
  lineColor?: string;
}) {
  return (
    <div className="relative py-[1rem]">
      <div className={`${lineColor} h-[1px] bg-tertiary-normal/30`}></div>
      <p className="font-bold text-xs text-gray-500 px-[0.5rem] bg-white absolute right-[50%] translate-x-[50%] translate-y-[-50%] top-[50%] z-10 bg-white]">
        {content}
      </p>
    </div>
  );
}

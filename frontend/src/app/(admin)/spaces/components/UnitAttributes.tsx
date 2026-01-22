"use client";

import { useEffect, useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";
import RenderIcon from "@/app/shared/ui/RenderIcon";
import { TiDelete } from "react-icons/ti";

export default function UnitAttributes() {
  const { control } = useFormContext<NewUnitSchema>();

  const { fields, remove } = useFieldArray({
    name: "attributes",
    control,
  });

  const attrContainerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(fields.length);

  const handleRemoveAttribute = (index: number) => {
    remove(index);
  };

  const handleScrollAttrCont = () => {
    if (!attrContainerRef.current) return;

    const container = attrContainerRef.current;

    container.scrollTo({
      left: container.scrollWidth - container.clientWidth,
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!fields) return;

    const prevLength = prevLengthRef.current;
    const currLength = fields.length;

    if (currLength > prevLength) {
      handleScrollAttrCont();
    }

    prevLengthRef.current = currLength;
  }, [fields.length]);

  return (
    <div
      className="border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] mt-[0.5rem] overflow-auto"
      ref={attrContainerRef}
    >
      <ul className="w-max h-[5rem] flex flex-col flex-wrap gap-3">
        {fields.map(({ iconId, name, quantity }, index) => {
          return (
            <li key={iconId}>
              <div className="relative">
                <div className="border-1 border-secondary-normal/50 rounded-lg p-[0.5rem] flex items-center gap-x-1">
                  <span className="text-base">
                    <RenderIcon iconId={iconId} />
                  </span>
                  <span>{quantity > 0 ? quantity : null}</span>
                  <span>{name}</span>
                </div>

                <button
                  onClick={() => handleRemoveAttribute(index)}
                  className="absolute right-0 top-0 translate-x-[50%] translate-y-[-50%]"
                >
                  <span className="text-xl">
                    <TiDelete />
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

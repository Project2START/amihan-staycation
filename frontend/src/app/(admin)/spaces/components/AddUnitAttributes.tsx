"use client";

import {
  type UseFormSetValue,
  type UseFormGetValues,
  type UseFormWatch,
  type UseFormRegister,
  useFormContext,
} from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";
import React, { useState } from "react";
import { attributeIcons } from "../constants/attributeIcons";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import RenderIcon from "@/app/shared/ui/RenderIcon";

interface IAddAttributeState {
  name: string;
  quantity: string;
  iconId: string;
}

type UnitAttributeProps = {
  onClose: () => void;
};

export default function AddUnitAttributes({ onClose }: UnitAttributeProps) {
  const { getValues, setValue } = useFormContext<NewUnitSchema>();

  const currentAttributeIcons = attributeIcons.filter(
    (attributeIcon) =>
      !(getValues("attributes") || []).some(
        (attribute) => attribute.iconId === attributeIcon.id
      )
  );

  const [newAttr, setNewAttr] = useState<IAddAttributeState>({
    name: "New attribute",
    quantity: "1",
    iconId: currentAttributeIcons[0].id,
  });

  const onSubmit = () => {
    const currentAttributes = getValues("attributes") || [];
    setValue("attributes", [
      ...currentAttributes,
      {
        ...newAttr,
        name: newAttr.name === "" ? "New attribute" : newAttr.name,
        quantity: newAttr.quantity === "" ? 0 : Number(newAttr.quantity),
      },
    ]);
    onClose();
  };

  const handleAttributeChange = (
    attr: keyof IAddAttributeState,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e) {
      setNewAttr((newAttr) => ({ ...newAttr, [attr]: e.target.value }));
    }
  };

  return (
    <div className="px-[1.5rem] pt-[2rem] pb-[1.5rem]">
      <h2 className="text-center">Add Unit Attribute</h2>
      <div>
        <div className="flex flex-col mt-[1rem]">
          <span className="font-bold">Name</span>
          <input
            type="text"
            placeholder="New attribute"
            value={newAttr.name}
            onChange={(e) => {
              handleAttributeChange("name", e);
            }}
            onFocus={(e) => e.target.select()}
            className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
          />
        </div>
        <div className="flex flex-col mt-[1rem]">
          <span className="font-bold">Quantity</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={newAttr.quantity}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                handleAttributeChange("quantity", e);
              }
            }}
            onFocus={(e) => e.target.select()}
            className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
          />
        </div>
        <div className="flex flex-col mt-[1rem]">
          <span className="font-bold">Icon</span>
          <div className="mt-[0.5rem] p-[0.75rem] overflow-auto bg-gray-300 rounded-lg">
            <ul className="grid grid-flow-col grid-rows-2 gap-4">
              {currentAttributeIcons.map(({ id }) => {
                if (newAttr.iconId === id) {
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        className="outline-2 outline-primary-normal rounded-sm"
                      >
                        <span className="text-2xl">
                          <RenderIcon iconId={id} />
                        </span>
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() =>
                        setNewAttr((newAttr) => ({ ...newAttr, iconId: id }))
                      }
                    >
                      <span className="text-2xl">
                        <RenderIcon iconId={id} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="mt-[1.5rem] flex items-center justify-center gap-x-7.5">
          <div>
            <PrimaryButton
              type="button"
              variant="text"
              style={{ backgroundColor: "none" }}
              onClick={onClose}
            >
              <span className="text-xs normal-case text-secondary-normal">
                Cancel
              </span>
            </PrimaryButton>
          </div>
          <div>
            <PrimaryButton
              type="button"
              onClick={() => {
                onSubmit();
              }}
            >
              <span className="text-xs px-[2.5rem] font-bold">Save</span>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

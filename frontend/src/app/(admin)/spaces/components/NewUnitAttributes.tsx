"use client";

import type {
  UseFormSetValue,
  UseFormGetValues,
  UseFormWatch,
  UseFormRegister,
} from "react-hook-form";
import { NewUnitSchema } from "../lib/newUnitSchema";
import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { attributeIcons } from "../constants/attributeIcons";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";

interface INewAttributeState {
  name: string;
  quantity: number;
  id: string;
}

type UnitAttributeProps = {
  setValue: UseFormSetValue<NewUnitSchema>;
  getValues: UseFormGetValues<NewUnitSchema>;
  watch: UseFormWatch<NewUnitSchema>;
  register: UseFormRegister<NewUnitSchema>;
};

export default function NewUnitAttributes({
  setValue,
  getValues,
  watch,
  register,
}: UnitAttributeProps) {
  const [newAttr, setNewAttr] = useState<INewAttributeState>({
    name: "",
    quantity: 0,
    id: attributeIcons[0].id,
  });
  const [openAddAttr, setOpenAddAttr] = useState<boolean>(false);
  return (
    <DialogBaseContent
      onCloseDialog={() => setOpenAddAttr(false)}
      enableClickOutside={false}
      openDialog={openAddAttr}
    >
      <div className="px-[1.5rem] pt-[2rem] pb-[1.5rem]">
        <h2 className="text-center">Add Unit Attribute</h2>
        <div>
          <div className="flex flex-col mt-[1rem]">
            <span className="font-bold">Name</span>
            <input
              type="text"
              placeholder="New attribute"
              className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
            />
          </div>
          <div className="flex flex-col mt-[1rem]">
            <span className="font-bold">Quantity</span>
            <input
              type="number"
              placeholder="0"
              className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
            />
          </div>
          <div className="flex flex-col mt-[1rem]">
            <span className="font-bold">Icon</span>
            <div className="mt-[0.5rem] p-[0.75rem] overflow-auto bg-gray-300 rounded-lg">
              <ul className="grid grid-flow-col grid-rows-2 gap-4">
                {attributeIcons.map(({ id, icon: Icon }) => {
                  return (
                    <li key={id}>
                      <button>
                        <span className="text-2xl">
                          <Icon />
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
              <PrimaryButton variant="text" style={{ backgroundColor: "none" }}>
                <span className="text-xs normal-case text-secondary-normal">
                  Cancel
                </span>
              </PrimaryButton>
            </div>
            <div>
              <PrimaryButton type="submit">
                <span className="text-xs px-[2.5rem] font-bold">Save</span>
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </DialogBaseContent>
  );
}

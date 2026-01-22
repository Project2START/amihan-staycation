"use client";

import { useForm, FormProvider } from "react-hook-form";
import { newUnitSchema, NewUnitSchema } from "../lib/newUnitSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import AddUnitAttributes from "./AddUnitAttributes";
import { FiPlusCircle } from "react-icons/fi";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import AddUnitPhotos from "./AddUnitPhotos";
import UnitAttributes from "./UnitAttributes";

export const unitDefaultAttributes = [
  { name: "Beds", iconId: "beds-1", quantity: 2 },
  {
    name: "Bathroom",
    iconId: "bathroom-1",
    quantity: 2,
  },
  {
    name: "Bedroom",
    iconId: "bedroom-1",
    quantity: 1,
  },
  {
    name: "Airconditioned",
    iconId: "airconditioned-1",
    quantity: 0,
  },
  {
    name: "Free Wifi",
    iconId: "free-wifi-1",
    quantity: 0,
  },
];

interface INewUnitProps {
  onCloseDialog: () => void;
}

export default function NewUnitForm({ onCloseDialog }: INewUnitProps) {
  const methods = useForm<NewUnitSchema>({
    resolver: zodResolver(newUnitSchema),
    defaultValues: {
      attributes: unitDefaultAttributes,
      photos: [],
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const [openAddAttr, setOpenAddAttr] = useState<boolean>(false);

  const onSubmit = async (data: NewUnitSchema) => {
    console.log(data);
  };

  return (
    <div className="relative text-secondary-normal text-xs px-[1.5rem] pt-[2rem] pb-[1.5rem]">
      <h1 className="text-center text-xl font-bold">Add New Unit</h1>
      <div className="mt-[1.5rem]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <span className="font-bold">Name</span>
              <input
                {...register("name")}
                placeholder="New unit"
                type="text"
                aria-describedby={errors.name ? "unitName-error" : undefined}
                className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
              />
              {errors.name && (
                <p className="text-red-900 text-[0.65rem]" id="unitName-error">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mt-[1rem]">
              <span className="font-bold">Price</span>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                placeholder="0.00"
                step="any"
                aria-describedby={errors.name ? "unitPrice-error" : undefined}
                className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
              />
              {errors.price && (
                <p className="text-red-900 text-[0.65rem]" id="unitPrice-error">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div className="flex flex-col mt-[1rem]">
              <span className="font-bold">Max persons</span>
              <input
                {...register("maxPersons", { valueAsNumber: true })}
                defaultValue={1}
                type="number"
                aria-describedby={
                  errors.name ? "unitMaxPersons-error" : undefined
                }
                className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
              />
              {errors.maxPersons && (
                <p
                  className="text-red-900 text-[0.65rem]"
                  id="unitMaxPersons-error"
                >
                  {errors.maxPersons.message}
                </p>
              )}
            </div>
            <div className="mt-[1.5rem]">
              <div className="flex items-center justify-between py-[-0.5rem]">
                <span className="font-bold">Attributes</span>
                <button type="button" onClick={() => setOpenAddAttr(true)}>
                  <span className="text-lg">
                    <FiPlusCircle />
                  </span>
                </button>
              </div>
              <UnitAttributes />
              <DialogBaseContent
                onCloseDialog={() => setOpenAddAttr(false)}
                enableClickOutside={false}
                openDialog={openAddAttr}
              >
                <AddUnitAttributes onClose={() => setOpenAddAttr(false)} />
              </DialogBaseContent>
            </div>
            <div className="mt-[1rem]">
              <AddUnitPhotos />
            </div>
            <div className="mt-[1.5rem] flex items-center justify-center gap-x-7.5">
              <div>
                <PrimaryButton
                  variant="text"
                  style={{ backgroundColor: "none" }}
                  onClick={onCloseDialog}
                >
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
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

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
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import toast from "react-hot-toast";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import Alert from "@mui/material/Alert";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import revalidatePathSpaces from "../_actions/revalidatePathSpaces";

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
  const [openAddAttr, setOpenAddAttr] = useState<boolean>(false);
  const [formError, setFormError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  const onSubmit = async (data: NewUnitSchema) => {
    setFormError(null);
    setLoading(true);

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string") {
        formData.append(key, value);
        return;
      }

      if (key === "photos") {
        data["photos"].forEach((photo) => {
          formData.append("photo_files", photo.file);
        });
        return;
      }

      formData.append(key, JSON.stringify(value));
    });

    try {
      const result = await axios.post(`${HOST}/api/products`, formData, {
        withCredentials: true,
      });

      CustomToast.show("Unit successfully created", {
        indicator: "success",
      });
      onCloseDialog();

      await revalidatePathSpaces();
    } catch (error) {
      setFormError(errorHandler(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-secondary-normal text-xs px-[1.5rem] py-[2rem]">
      <h1 className="text-center text-xl font-bold">Add New Unit</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[1rem] h-[23rem] overflow-y-auto px-[0.25rem] pb-[1rem]">
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
            <div className="flex flex-col mt-[1rem]">
              <span className="font-bold">About</span>
              <div className="mt-[0.5rem] h-[7rem]">
                <textarea
                  {...register("about")}
                  id="unit-about"
                  className="w-full h-full border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] input-base-focus"
                  placeholder="Tell something about this unit..."
                  aria-describedby={
                    errors.about ? "unitAbout-error" : undefined
                  }
                ></textarea>
              </div>
              {errors.about && (
                <p className="text-red-900 text-[0.65rem]" id="unitAbout-error">
                  {errors.about.message}
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
          </div>
          <div className="mt-[1rem]">
            {formError && (
              <p className="text-center text-[0.65rem] pb-[0.5rem] text-red-900">
                {formError}
              </p>
            )}
            <div className="flex items-center justify-center gap-x-7.5">
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
                <LoadingOverlay loading={loading}>
                  <PrimaryButton type="submit" disabled={loading}>
                    <span className="text-xs px-[2.5rem] font-bold">Save</span>
                  </PrimaryButton>
                </LoadingOverlay>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

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
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import { HOST } from "@/app/shared/constants/config";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import revalidatePathSpaces from "../_actions/revalidatePathSpaces";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      await axiosWithAuth.post(`${HOST}/api/products`, formData);

      CustomToast.show("Unit successfully created", {
        indicator: "success",
      });
      onCloseDialog();

      await revalidatePathSpaces();
      window.dispatchEvent(new Event("spaces:updated"));
      router.refresh();
    } catch (error) {
      setFormError(errorHandler(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative px-[1.5rem] py-[2rem] text-xs text-secondary-normal lg:px-[2rem] lg:py-[1.75rem] lg:text-sm xl:px-[2.25rem]">
      <h1 className="text-center text-xl font-bold lg:text-2xl">
        Add New Unit
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-[1rem] h-[23rem] overflow-y-auto px-[0.25rem] pb-[1rem] lg:mt-[1.25rem] lg:h-[25rem] lg:px-[0.5rem] lg:pb-[1.25rem]">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-5 lg:gap-y-1">
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
                  <p
                    className="text-red-900 text-[0.65rem]"
                    id="unitName-error"
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col mt-[1rem] lg:mt-0">
                <span className="font-bold">Price</span>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  placeholder="0.00"
                  step="any"
                  aria-describedby={errors.name ? "unitPrice-error" : undefined}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="mt-[0.5rem] border-b-2 border-secondary-normal/30 py-[0.5rem] input-base-focus"
                />
                {errors.price && (
                  <p
                    className="text-red-900 text-[0.65rem]"
                    id="unitPrice-error"
                  >
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-[1rem] lg:mt-[1.25rem]">
              <span className="font-bold">Max persons</span>
              <input
                {...register("maxPersons", { valueAsNumber: true })}
                defaultValue={1}
                type="number"
                aria-describedby={
                  errors.name ? "unitMaxPersons-error" : undefined
                }
                onWheel={(e) => e.currentTarget.blur()}
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
            <div className="flex flex-col mt-[1rem] lg:col-span-2 lg:mt-[1.25rem]">
              <span className="font-bold">About</span>
              <div className="mt-[0.5rem] h-[7rem] lg:h-[10rem]">
                <textarea
                  {...register("about")}
                  id="unit-about"
                  className="resize-none w-full h-full border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] input-base-focus"
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
            <div className="mt-[1.5rem] lg:col-span-2 lg:mt-[1.75rem] lg:rounded-xl lg:border lg:border-secondary-normal/15 lg:bg-[#fafbfc] lg:p-[1rem]">
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
            <div className="mt-[1rem] lg:col-span-2 lg:mt-[1.25rem] lg:rounded-xl lg:border lg:border-secondary-normal/15 lg:bg-[#fafbfc] lg:p-[1rem]">
              <AddUnitPhotos />
            </div>
          </div>
          <div className="mt-[1rem] lg:mt-[1.25rem]">
            {formError && (
              <p className="text-center text-[0.65rem] pb-[0.5rem] text-red-900">
                {formError}
              </p>
            )}
            <div className="flex items-center justify-center gap-x-7.5 lg:justify-end lg:gap-x-3">
              <div>
                <PrimaryButton
                  variant="text"
                  style={{ backgroundColor: "none" }}
                  onClick={onCloseDialog}
                  disabled={loading}
                >
                  <span className="text-xs normal-case text-secondary-normal lg:text-sm">
                    Cancel
                  </span>
                </PrimaryButton>
              </div>
              <div>
                <LoadingOverlay loading={loading}>
                  <PrimaryButton type="submit" disabled={loading}>
                    <span className="text-xs px-[2.5rem] font-bold lg:text-sm lg:px-[3rem]">
                      Save
                    </span>
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

"use client";

import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";
import DialogBaseContent from "@/app/shared/ui/DialogBaseContent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiSettings } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { deleteUnitProduct } from "../../api/deleteUnitProduct";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import LoadingOverlay from "@/app/shared/ui/LoadingOverlay";
import { IoIosAlert } from "react-icons/io";
import { Product } from "./Product";
import ProductEdit from "./ProductEdit";
import { useAppSelector } from "@/lib/hooks";

export default function ProductHeader({ product }: { product: Product }) {
  const user = useAppSelector((state) => state.users.data);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { id, name } = product;

  const handleDeleteProduct = async () => {
    setLoading(true);

    try {
      await deleteUnitProduct(id);

      CustomToast.show("Unit successfully deleted", {
        indicator: "success",
      });

      router.push(`/spaces`);
    } catch (err) {
      CustomToast.show(errorHandler(err).message, {
        indicator: "error",
      });
    } finally {
      setLoading(false);
      setDeleteDialog(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-[1.5rem]">
      <div className="w-[3rem] shrink-0">
        <PrimaryBackButton
          onClick={() => {
            router.back();
          }}
          style="text-xl"
        />
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <h1 className="text-center truncate" title={name}>
          {name}
        </h1>
      </div>

      <div className="w-auto shrink-0">
        <div className="flex items-center justify-center gap-x-3 md:hidden">
          <button type="button" aria-label="settings">
            <span className="text-xl text-gray-500">
              <CiSettings />
            </span>
          </button>
          <button
            type="button"
            aria-label="edit unit"
            onClick={() => setEditDialog(true)}
          >
            <span className="text-xl text-gray-500">
              <GoPencil />
            </span>
          </button>
          <button
            type="button"
            aria-label="delete unit"
            onClick={() => {
              setDeleteDialog(true);
            }}
          >
            <span className="text-xl text-reject-normal">
              <RiDeleteBin6Line />
            </span>
          </button>
        </div>

        <div className="hidden items-center gap-2 md:flex lg:gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
            aria-label="settings"
          >
            <CiSettings className="text-base" />
            Settings
          </button>

          <button
            type="button"
            onClick={() => setEditDialog(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary-normal/25 bg-primary-light/35 px-3 py-1.5 text-xs font-semibold text-secondary-normal transition hover:bg-primary-light/55"
            aria-label="edit unit"
          >
            <GoPencil className="text-sm" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              setDeleteDialog(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-reject-normal/20 bg-reject-normal/10 px-3 py-1.5 text-xs font-semibold text-reject-normal transition hover:bg-reject-normal/20"
            aria-label="delete unit"
          >
            <RiDeleteBin6Line className="text-sm" />
            Delete
          </button>
        </div>
      </div>

      <DialogBaseContent
        openDialog={deleteDialog}
        onCloseDialog={() => {
          setDeleteDialog(false);
        }}
      >
        <div className="px-[2rem] pt-[1.5rem] pb-[1rem] text-sm">
          <p className="text-center flex items-center">
            <span className="text-reject-normal text-2xl">
              <IoIosAlert />
            </span>
            <span>
              Do you want to delete this unit?{" "}
              <b>This action can't be undone.</b>
            </span>
          </p>
          <div className="flex justify-center gap-x-8 items-center mt-[1rem]">
            <div>
              <button disabled={loading} onClick={() => setDeleteDialog(false)}>
                No
              </button>
            </div>
            <div>
              <LoadingOverlay loading={loading}>
                <button
                  disabled={loading}
                  onClick={handleDeleteProduct}
                  className="bg-reject-normal font-bold px-[2rem] py-[0.25rem] text-white rounded-lg"
                >
                  Yes
                </button>
              </LoadingOverlay>
            </div>
          </div>
        </div>
      </DialogBaseContent>
      <DialogBaseContent
        onCloseDialog={() => setEditDialog(false)}
        openDialog={editDialog}
        scrollVertically={false}
      >
        <ProductEdit
          product={product}
          onCloseDialog={() => setEditDialog(false)}
        />
      </DialogBaseContent>
    </div>
  );
}

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
    <div className="flex justify-between items-center py-[1.5rem]">
      <div className="flex-1/4">
        <PrimaryBackButton
          onClick={() => {
            router.push(`/spaces`);
          }}
          style="text-xl"
        />
      </div>
      <div className="flex-2/4 overflow-x-hidden">
        <h1 className="text-center truncate" title={name}>
          {name}
        </h1>
      </div>
      <div className="flex-1/4 flex justify-center items-center gap-x-3">
        <div>
          <button>
            <span className="text-xl text-gray-500">
              <CiSettings />
            </span>
          </button>
        </div>
        <div>
          <button onClick={() => setEditDialog(true)}>
            <span className="text-xl text-gray-500">
              <GoPencil />
            </span>
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              setDeleteDialog(true);
            }}
          >
            <span className="text-xl text-reject-normal">
              <RiDeleteBin6Line />
            </span>
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

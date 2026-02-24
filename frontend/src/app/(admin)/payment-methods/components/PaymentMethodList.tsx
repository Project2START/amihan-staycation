"use client";

import { useState } from "react";
import type { IPaymentMethod } from "../types/paymentMethod.types";
import PaymentMethodItem from "./PaymentMethodItem";
import PaymentMethodDetail from "./PaymentMethodDetail";
import DeletePaymentMethod from "./DeletePaymentMethod";
import { deletePaymentMethod } from "../api/deletePaymentMethod";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import revalidatePaymentMethods from "../_actions/revalidatePaymentMethods";

export default function PaymentMethodList({
  paymentMethods,
}: {
  paymentMethods: IPaymentMethod[];
}) {
  const [selectedMethod, setSelectedMethod] = useState<IPaymentMethod | null>(
    null,
  );
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeletePaymentMethod = async (id: string) => {
    setDeleteLoading(true);

    try {
      await deletePaymentMethod(id);

      CustomToast.show("Payment successfully deleted", {
        indicator: "success",
      });

      revalidatePaymentMethods();
      setSelectedMethod(null);
    } catch (err) {
      CustomToast.show(errorHandler(err).message, {
        indicator: "error",
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialog(false);
    }
  };

  return (
    <>
      {paymentMethods.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-center font-bold text-lg text-gray-300">
            No payment methods yet. <br /> Tap the + button to add one.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-y-5 text-secondary-normal">
          {paymentMethods.map((method) => (
            <li key={method.id}>
              <PaymentMethodItem
                method={method}
                onClick={() => setSelectedMethod(method)}
              />
            </li>
          ))}
        </ul>
      )}

      <PaymentMethodDetail
        method={selectedMethod}
        open={!!selectedMethod}
        onClose={() => setSelectedMethod(null)}
        enableClickOutside={!deleteDialog}
        onDeleteClick={() => setDeleteDialog(true)}
      />

      <DeletePaymentMethod
        open={deleteDialog}
        loading={deleteLoading}
        onClose={() => setDeleteDialog(false)}
        onConfirm={() => {
          if (selectedMethod) handleDeletePaymentMethod(selectedMethod.id);
        }}
      />
    </>
  );
}

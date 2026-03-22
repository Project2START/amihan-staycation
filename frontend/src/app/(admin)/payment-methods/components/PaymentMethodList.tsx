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
        <div className="flex items-center justify-center h-[60vh] md:h-[52vh] rounded-xl md:border md:border-secondary-normal/10 md:bg-white">
          <div className="text-center px-4">
            <p className="text-center font-bold text-lg md:text-xl text-gray-400 md:text-secondary-normal">
              No payment methods yet.
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-2">
              Add a method to start accepting direct payments.
            </p>
          </div>
        </div>
      ) : (
        <div className="md:rounded-xl md:border md:border-secondary-normal/10 md:bg-white md:p-5 lg:p-6 md:shadow-sm">
          <div className="hidden md:flex items-center justify-between mb-5 lg:mb-6">
            <h2 className="text-base lg:text-lg font-semibold text-secondary-normal">
              Configured Methods
            </h2>
            <span className="text-xs lg:text-sm text-gray-500">
              {paymentMethods.length} total
            </span>
          </div>

          <ul className="flex flex-col gap-y-5 md:gap-4 lg:gap-5 text-secondary-normal">
            {paymentMethods.map((method) => (
              <li key={method.id}>
                <PaymentMethodItem
                  method={method}
                  onClick={() => setSelectedMethod(method)}
                />
              </li>
            ))}
          </ul>
        </div>
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

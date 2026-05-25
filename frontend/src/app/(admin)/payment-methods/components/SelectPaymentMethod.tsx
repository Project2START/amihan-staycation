"use client";

import { useFormContext } from "react-hook-form";
import { AddPaymentMethodSchema } from "../schema/addPaymentMethod.schema";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import Image from "next/image";
import getPaymentOptions from "@/app/shared/lib/getPaymentOptions";

const paymentOptions = getPaymentOptions();

export default function SelectPaymentMethod() {
  const [selectOpen, setSelectOpen] = useState(false);

  const { watch, setValue, clearErrors } =
    useFormContext<AddPaymentMethodSchema>();

  const paymentMethod = watch("payment_method");

  const handleOpenSelection = () => {
    setSelectOpen((prev) => !prev);
  };

  const handleCloseSelection = () => {
    setSelectOpen(false);
  };

  const handleSelect = (method: string) => {
    setValue("payment_method", method);
    clearErrors("payment_method");
    handleCloseSelection();
  };

  const selectedOption = paymentOptions.find(
    (opt) => opt.paymentName === paymentMethod,
  );

  return (
    <div className="relative border-2 border-secondary-normal/30 rounded-lg h-full text-primary-secondary">
      <button
        type="button"
        onClick={handleOpenSelection}
        className="w-full h-full flex justify-between items-center p-[0.5rem] overflow-hidden"
      >
        <span className="text-left flex items-center gap-x-2">
          {selectedOption ? (
            <>
              <span className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src={selectedOption.paymentImage}
                  alt={selectedOption.paymentName}
                  fill
                  className="object-contain"
                  sizes="20px"
                />
              </span>
              <span>{selectedOption.paymentName}</span>
            </>
          ) : (
            "Select payment method"
          )}
        </span>
        <span className="text-lg">
          <IoMdArrowDropdown />
        </span>
      </button>

      <AnimatePresence>
        {selectOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="select-payment-method"
            className="absolute w-[100%] top-[100%] z-999"
          >
            <ClickOutside onClickOutside={handleCloseSelection}>
              <div className="h-[12.5rem] bg-white shadow-lg rounded-lg overflow-y-auto overflow-x-hidden">
                <ul>
                  {paymentOptions.map((option) => {
                    const isSelected = option.paymentName === paymentMethod;
                    return (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(option.paymentName)}
                          className={`flex items-center gap-x-3 p-[0.5rem] text-left w-full ${
                            isSelected
                              ? "bg-secondary-normal text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="relative w-6 h-6 flex-shrink-0">
                            <Image
                              src={option.paymentImage}
                              alt={option.paymentName}
                              fill
                              className="object-contain"
                              sizes="24px"
                            />
                          </div>
                          <span className={isSelected ? "font-bold" : ""}>
                            {option.paymentName}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </ClickOutside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

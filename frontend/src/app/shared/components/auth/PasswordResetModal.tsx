"use client";

import { IoClose } from "react-icons/io5";
import { motion } from "motion/react";
import PasswordResetRequestForm from "./PasswordResetRequestForm";

type PasswordResetModalProps = {
  email: string;
  onClose: () => void;
};

export default function PasswordResetModal({
  email,
  onClose,
}: PasswordResetModalProps) {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-[420px] p-6 z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-secondary-normal">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-3 lg:text-sm">
          We will send a secure reset link to your registered email.
        </p>

        <PasswordResetRequestForm
          initialEmail={email}
          lockEmail
          source="profile"
        />
      </motion.div>
    </div>
  );
}

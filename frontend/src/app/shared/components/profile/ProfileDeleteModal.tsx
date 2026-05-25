"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IoClose } from "react-icons/io5";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import { HOST } from "@/app/shared/constants/config";
import { useAppDispatch } from "@/lib/hooks";
import { resetUser } from "@/lib/features/users/usersSlice";
import { useRouter } from "next/navigation";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { logout } from "@/app/(user)/api/logout";
import { resetAuthTokenCache } from "@/app/shared/lib/getAuthToken";

interface ProfileDeleteModalProps {
  userId: string;
  onClose: () => void;
}

export default function ProfileDeleteModal({
  userId,
  onClose,
}: ProfileDeleteModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;

    setLoading(true);

    try {
      await axiosWithAuth.delete(`${HOST}/api/users/${userId}`);

      await fetch("/api/auth/clear-cookies", {
        method: "DELETE",
      });

      resetAuthTokenCache();
      dispatch(resetUser());

      CustomToast.show("Account deleted successfully", {
        indicator: "success",
      });

      router.replace("/sign-in");
    } catch (err) {
      CustomToast.show(errorHandler(err).message, { indicator: "error" });
      setLoading(false);
    }
  };

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
          <h2 className="text-base font-bold text-reject-normal">
            Delete Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This action is <strong>permanent</strong> and cannot be undone. All
            your data, bookings, and account information will be permanently
            deleted.
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-reject-normal/50"
            />
          </div>

          <div className="flex gap-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-1.5 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              <span className="text-xs">Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete || loading}
              className="flex-1 py-1.5 bg-reject-normal text-white rounded-lg font-bold hover:opacity-90 transition cursor-pointer disabled:opacity-40"
            >
              <span className="text-xs">
                {loading ? "Deleting..." : "Delete Account"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

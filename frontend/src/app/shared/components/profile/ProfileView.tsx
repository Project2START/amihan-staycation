"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import ProfileEditModal from "./ProfileEditModal";
import ProfileDeleteModal from "./ProfileDeleteModal";
import ProfileViewMobile from "./ProfileViewMobile";
import ProfileViewLarge from "./ProfileViewLarge";
import PasswordResetModal from "../auth/PasswordResetModal";

export default function ProfileView() {
  const router = useRouter();
  const user = useAppSelector((state) => state.users.data);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-center font-bold text-lg text-gray-300">
          Not logged in
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="md:hidden">
        <ProfileViewMobile
          user={user}
          onBack={() => router.back()}
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteOpen(true)}
          onResetPassword={() => setResetOpen(true)}
        />
      </div>

      <div className="hidden md:block">
        <ProfileViewLarge
          user={user}
          onBack={() => router.back()}
          onEdit={() => setEditOpen(true)}
          onDelete={() => setDeleteOpen(true)}
          onResetPassword={() => setResetOpen(true)}
        />
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <ProfileEditModal user={user} onClose={() => setEditOpen(false)} />
      )}

      {/* Delete Modal */}
      {deleteOpen && (
        <ProfileDeleteModal
          userId={user.id}
          onClose={() => setDeleteOpen(false)}
        />
      )}

      {resetOpen && (
        <PasswordResetModal
          email={user.email}
          onClose={() => setResetOpen(false)}
        />
      )}
    </div>
  );
}

export function ProfileField({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string | null | undefined;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span
        className={`text-sm text-secondary-normal font-semibold ${capitalize ? "capitalize" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

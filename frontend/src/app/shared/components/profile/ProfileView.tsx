"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { IoMdPerson } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import ProfileEditModal from "./ProfileEditModal";
import ProfileDeleteModal from "./ProfileDeleteModal";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";

export default function ProfileView() {
  const router = useRouter();
  const user = useAppSelector((state) => state.users.data);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    <div className="px-[1rem] py-[1.5rem] md:px-[2rem] lg:px-[3rem]">
      <div className="flex items-center justify-between mb-6 mt-3">
        <div className="flex-1/3">
          <PrimaryBackButton
            style="text-xl text-secondary-normal"
            onClick={() => router.back()}
          />
        </div>

        <h1 className="text-lg font-bold text-secondary-normal flex-1/3 text-center">
          My Profile
        </h1>
        <span className="flex-1/3"></span>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl border-2 border-secondary-normal/30 p-6 space-y-4">
        {/* Avatar */}
        <div className="flex justify-center">
          {user.avatar_url ? (
            <div className="relative w-[6rem] h-[6rem] rounded-full overflow-hidden border-3 border-gray-300">
              <Image
                src={user.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-[6rem] h-[6rem] rounded-full border-3 border-gray-300">
              <IoMdPerson className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>
        <ProfileField label="First Name" value={user.first_name} />
        <ProfileField label="Last Name" value={user.last_name} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField label="Nationality" value={user.nationality} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-y-3">
        <button
          onClick={() => setEditOpen(true)}
          className="flex items-center justify-center gap-x-2 w-full py-3 bg-secondary-normal text-white font-bold rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          <MdEdit className="text-base" />
          <span className="text-sm">Edit Profile</span>
        </button>

        <button
          onClick={() => setDeleteOpen(true)}
          className="flex items-center justify-center gap-x-2 w-full py-3 bg-reject-normal text-white font-bold rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          <span className="text-sm">Delete Account</span>
        </button>
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
    </div>
  );
}

function ProfileField({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
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

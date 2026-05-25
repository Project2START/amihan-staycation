import { IoMdPerson } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import Image from "next/image";
import PrimaryBackButton from "@/app/shared/components/PrimaryBackButton";

type ProfileUser = {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  nationality?: string | null;
  avatar_url?: string | null;
};

export default function ProfileViewMobile({
  user,
  onBack,
  onEdit,
  onDelete,
  onResetPassword,
}: {
  user: ProfileUser;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: () => void;
}) {
  return (
    <div className="px-[1rem] py-[1.5rem]">
      <div className="flex items-center justify-between mb-6 mt-3">
        <div className="flex-1/3">
          <PrimaryBackButton
            style="text-xl text-secondary-normal"
            onClick={onBack}
          />
        </div>

        <h1 className="text-lg font-bold text-secondary-normal flex-1/3 text-center">
          My Profile
        </h1>
        <span className="flex-1/3" />
      </div>

      <div className="bg-white rounded-xl border-2 border-secondary-normal/30 p-6 space-y-4">
        <div className="flex justify-center">
          {user.avatar_url ? (
            <div className="relative w-[6rem] h-[6rem] rounded-full overflow-hidden border-3 border-gray-300">
              <Image
                src={user.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-[6rem] h-[6rem] rounded-full border-3 border-gray-300">
              <IoMdPerson className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>

        <Field label="First Name" value={user.first_name} />
        <Field label="Last Name" value={user.last_name} />
        <Field label="Email" value={user.email} />
        <Field label="Nationality" value={user.nationality} />
      </div>

      <div className="mt-6 flex flex-col gap-y-3">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-x-2 w-full py-3 bg-secondary-normal text-white font-bold rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          <MdEdit className="text-base" />
          <span className="text-sm">Edit Profile</span>
        </button>
        <button
          onClick={onResetPassword}
          className="flex items-center justify-center gap-x-2 w-full py-3 bg-secondary-normal text-white font-bold rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          <span className="text-sm">Change Password</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-x-2 w-full py-3 bg-reject-normal text-white font-bold rounded-lg cursor-pointer hover:opacity-90 transition"
        >
          <span className="text-sm">Delete Account</span>
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-sm text-secondary-normal font-semibold">
        {value || "-"}
      </span>
    </div>
  );
}

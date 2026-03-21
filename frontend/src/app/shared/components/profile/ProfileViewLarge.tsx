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

export default function ProfileViewDesktop({
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
  const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();

  return (
    <div className="px-[2rem] py-[2rem] lg:px-[3rem]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="w-1/3">
            <PrimaryBackButton
              style="text-xl text-secondary-normal"
              onClick={onBack}
            />
          </div>
          <h1 className="w-1/3 text-center text-2xl lg:text-3xl font-extrabold text-secondary-normal tracking-tight">
            My Profile
          </h1>
          <span className="w-1/3" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border-2 border-secondary-normal/25 bg-gradient-to-b from-secondary-normal/10 to-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {user.avatar_url ? (
                <div className="relative w-[8rem] h-[8rem] rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={user.avatar_url}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-[8rem] h-[8rem] rounded-full border-4 border-white bg-gray-100 shadow-md">
                  <IoMdPerson className="text-gray-400 text-6xl" />
                </div>
              )}

              <h2 className="mt-4 text-xl font-extrabold text-secondary-normal">
                {fullName || "Unknown User"}
              </h2>
              <p className="mt-1 text-sm text-gray-600 break-all">
                {user.email || "-"}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={onEdit}
                className="flex items-center justify-center gap-x-2 w-full py-3.5 bg-secondary-normal text-white font-bold rounded-xl cursor-pointer hover:opacity-90 transition"
              >
                <MdEdit className="text-lg" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={onDelete}
                className="flex items-center justify-center gap-x-2 w-full py-3.5 bg-reject-normal text-white font-bold rounded-xl cursor-pointer hover:opacity-90 transition"
              >
                <span>Delete Account</span>
              </button>

              <button
                onClick={onResetPassword}
                className="flex items-center justify-center gap-x-2 w-full py-3.5 bg-secondary-normal text-white font-bold rounded-xl cursor-pointer hover:opacity-90 transition"
              >
                <span>Change Password</span>
              </button>
            </div>
          </section>

          <section className="rounded-2xl border-2 border-secondary-normal/25 bg-white p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary-normal">
                Account Details
              </h3>
              <span className="text-xs uppercase tracking-[0.18em] text-secondary-normal/60">
                Personal Info
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailCard label="First Name" value={user.first_name} />
              <DetailCard label="Last Name" value={user.last_name} />
              <DetailCard
                label="Email"
                value={user.email}
                className="md:col-span-2"
              />
              <DetailCard label="Nationality" value={user.nationality} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-secondary-normal/20 bg-secondary-normal/5 p-4 ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-secondary-normal break-words">
        {value || "-"}
      </p>
    </div>
  );
}

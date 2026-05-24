"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoClose } from "react-icons/io5";
import { IoMdArrowDropdown, IoMdPerson } from "react-icons/io";
import { MdCameraAlt } from "react-icons/md";
import Image from "next/image";
import axiosWithAuth from "@/app/shared/lib/axiosWithAuth";
import { HOST } from "@/app/shared/constants/config";
import { useAppDispatch } from "@/lib/hooks";
import { fetchUser } from "@/lib/features/users/usersThunks";
import { CustomToast } from "@/app/shared/ui/CustomToast";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import ClickOutside from "@/app/shared/ui/ClickOutside";
import { getNames, registerLocale } from "i18n-nationality";

registerLocale(require("i18n-nationality/langs/en.json"));

const nationalities = getNames("en");

const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+){0,2}$/;
const NAME_MIN = 2;
const NAME_MAX = 50;

interface ProfileEditModalProps {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    nationality: string;
    avatar_url: string;
  };
  onClose: () => void;
}

interface FormErrors {
  first_name?: string;
  last_name?: string;
  nationality?: string;
  avatar?: string;
}

export default function ProfileEditModal({
  user,
  onClose,
}: ProfileEditModalProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [nationality, setNationality] = useState(user.nationality);
  const [selectNationality, setSelectNationality] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar_url || null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleOpenSelection = () => {
    setSelectNationality(true);
  };

  const handleCloseSelection = () => {
    setSelectNationality(false);
  };

  const handleSelectNationality = (n: string) => {
    setNationality(n);
    setErrors((prev) => {
      const { nationality: _nationality, ...rest } = prev;
      return rest;
    });
    handleCloseSelection();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Only JPEG, PNG, WEBP, or AVIF images are allowed",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        avatar: "Image must be less than 5MB",
      }));
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => {
      const { avatar, ...rest } = prev;
      return rest;
    });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!firstName.trim()) {
      newErrors.first_name = "First name is required";
    } else if (firstName.length < NAME_MIN) {
      newErrors.first_name = `First name must be at least ${NAME_MIN} characters`;
    } else if (firstName.length > NAME_MAX) {
      newErrors.first_name = `First name cannot exceed ${NAME_MAX} characters`;
    } else if (!NAME_REGEX.test(firstName)) {
      newErrors.first_name = "First name can only contain letters and spaces";
    }

    if (!lastName.trim()) {
      newErrors.last_name = "Last name is required";
    } else if (lastName.length < NAME_MIN) {
      newErrors.last_name = `Last name must be at least ${NAME_MIN} characters`;
    } else if (lastName.length > NAME_MAX) {
      newErrors.last_name = `Last name cannot exceed ${NAME_MAX} characters`;
    } else if (!NAME_REGEX.test(lastName)) {
      newErrors.last_name = "Last name can only contain letters and spaces";
    }

    if (!nationality.trim()) {
      newErrors.nationality = "Nationality is required";
    } else if (nationality.length > 100) {
      newErrors.nationality = "Nationality cannot exceed 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        await axiosWithAuth.patch(
          `${HOST}/api/users/${user.id}/avatar`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }

      // Update profile fields
      await axiosWithAuth.patch(`${HOST}/api/users/${user.id}`, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        nationality: nationality.trim(),
      });

      // Refresh user data in Redux
      dispatch(fetchUser(user.id));

      CustomToast.show("Profile updated successfully", {
        indicator: "success",
      });
      onClose();
    } catch (err) {
      CustomToast.show(errorHandler(err).message, { indicator: "error" });
    } finally {
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
        className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-[420px] p-6 z-10 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-secondary-normal">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <IoClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
            >
              {avatarPreview ? (
                <div className="relative w-[5rem] h-[5rem] rounded-full overflow-hidden border-3 border-gray-300">
                  <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-[5rem] h-[5rem] rounded-full border-3 border-gray-300">
                  <IoMdPerson className="text-gray-400 text-3xl" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <MdCameraAlt className="text-white text-xl" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp, image/avif"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <span className="text-xs text-gray-400 mt-1">
              Click to change photo
            </span>
            {errors.avatar && (
              <span className="text-xs text-reject-normal mt-1">
                {errors.avatar}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nationality
            </label>
            <div className="relative border border-gray-300 rounded-lg text-primary-secondary">
              <button
                type="button"
                onClick={handleOpenSelection}
                className="w-full flex justify-between items-center px-3 py-2 overflow-hidden"
              >
                <span className="text-left text-base">{nationality}</span>
                <span className="text-lg">
                  <IoMdArrowDropdown />
                </span>
              </button>

              <AnimatePresence>
                {selectNationality ? (
                  <motion.div
                    initial={{ opacity: 0, translateY: "-5%" }}
                    animate={{ opacity: 1, translateY: "0%" }}
                    exit={{ opacity: 0, translateY: "-5%" }}
                    key="profile-select-nationalities"
                    data-testid="profile-select-nationalities"
                    className="absolute w-full top-full mt-2 z-20"
                  >
                    <ClickOutside onClickOutside={handleCloseSelection}>
                      <div className="h-[12.5rem] bg-white shadow-lg rounded-lg overflow-y-auto overflow-x-hidden">
                        <ul>
                          {Object.keys(nationalities)
                            .map((n) => {
                              return nationalities[n];
                            })
                            .sort()
                            .map((n) => {
                              if (n === nationality) {
                                return (
                                  <li key={n}>
                                    <button
                                      type="button"
                                      onClick={() => handleSelectNationality(n)}
                                      className="p-[0.5rem] text-left w-full bg-secondary-normal text-white"
                                    >
                                      <span className="font-bold">{n}</span>
                                    </button>
                                  </li>
                                );
                              }

                              return (
                                <li key={n}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectNationality(n)}
                                    className="p-[0.5rem] text-left w-full"
                                  >
                                    <span>{n}</span>
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
            {errors.nationality && (
              <span className="text-xs text-reject-normal mt-1 block">
                {errors.nationality}
              </span>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-normal/50"
            />
            {errors.first_name && (
              <span className="text-xs text-reject-normal mt-1 block">
                {errors.first_name}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-normal/50"
            />
            {errors.last_name && (
              <span className="text-xs text-reject-normal mt-1 block">
                {errors.last_name}
              </span>
            )}
          </div>

          <div className="flex gap-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-sm flex-1 py-1.5 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              <span className="text-xs">Cancel</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-1.5 bg-secondary-normal text-white rounded-lg font-bold hover:opacity-90 transition cursor-pointer disabled:opacity-60"
            >
              <span className="text-xs">
                {loading ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

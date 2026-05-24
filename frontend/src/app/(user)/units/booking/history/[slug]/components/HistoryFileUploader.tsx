"use client";

import { useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import Image from "next/image";
import PhotoFullViewDialog from "@/app/shared/components/PhotoFullViewDialog";

interface IHistoryFileUploader {
  label: string;
  file: File | null;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onDelete: () => void;
  error?: string;
  disabled?: boolean;
}

export default function HistoryFileUploader({
  label,
  file,
  previewUrl,
  onSelect,
  onDelete,
  error,
  disabled = false,
}: IHistoryFileUploader) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-y-1">
      <span className="font-bold text-xs">{label}</span>
      {previewUrl ? (
        <div className="w-full border-2 border-secondary-normal/30 rounded-lg py-[0.25rem] h-[8rem] relative">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative rounded-lg w-[40%] h-full">
              <PhotoFullViewDialog url={previewUrl}>
                <Image
                  src={previewUrl}
                  fill
                  className="object-cover object-center"
                  alt="Upload preview"
                  sizes="100%"
                />
              </PhotoFullViewDialog>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => {
                    onDelete();
                  }}
                >
                  <span className="w-max h-max text-lg absolute text-reject-normal top-0 right-0 translate-y-[-50%] translate-x-[50%] bg-white rounded-full">
                    <IoIosCloseCircle />
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-secondary-normal/30 rounded-lg p-[0.75rem] h-[8rem] disabled:opacity-40"
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center gap-x-2 opacity-50">
              <span className="text-lg">
                <MdOutlineFileUpload />
              </span>
              <span className="font-bold">Upload</span>
            </div>
          </div>
        </button>
      )}
      {error && <p className="text-red-900 text-[0.65rem]">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/avif"
        onChange={(e) => {
          if (!e.target.files || e.target.files.length === 0) return;
          const selectedFile = e.target.files[0];
          onSelect(selectedFile);
          e.target.value = "";
        }}
      />
    </div>
  );
}

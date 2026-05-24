"use client";

import ButtonLoadingStopper from "@/app/shared/components/ButtonLoadingStopper";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

const getSafeRedirectPath = (path: string | null) => {
  if (!path) return null;
  if (!path.startsWith("/")) return null;
  if (path.startsWith("//")) return null;

  return path;
};

export default function CodeInput({ id }: { id?: string }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorLabel, setErrorLabel] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      await axios.post("/api/auth/sign-up", {
        id,
        verificationCode: otp,
      });

      setErrorLabel("");

      localStorage.removeItem("registree_client_resendCountdown");

      await fetch("/api/auth/registree/clear-cookies", {
        method: "DELETE",
      });

      router.push(redirectPath ?? "/auth");
    } catch (error) {
      const errorResult = errorHandler(error);

      setErrorLabel(errorResult.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-[1rem]">
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="input-base py-[0.5rem] px-[3rem] text-center tracking-[0.5rem] text-xl font-bold text-secondary-normal"
          placeholder="******"
          maxLength={6}
          value={otp}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) setOtp(value);
          }}
        />
        <div className="flex justify-center mt-[1rem]">
          <div className="w-[80%]">
            {errorLabel.length !== 0 && (
              <p className="text-xs text-center mb-[0.5rem] text-red-900 font-bold">
                {errorLabel}
              </p>
            )}
            <ButtonLoadingStopper loading={loading}>
              <PrimaryButton
                style={{ padding: "0.5rem" }}
                disabled={otp.length < 6 || loading}
                type="submit"
              >
                Submit Code
              </PrimaryButton>
            </ButtonLoadingStopper>
          </div>
        </div>
      </form>
    </div>
  );
}

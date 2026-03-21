"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonLoadingStopper from "@/app/shared/components/ButtonLoadingStopper";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import {
  completePasswordReset,
  validatePasswordResetToken,
} from "@/app/shared/api/passwordReset";

const getSafeSource = (value: string | null): "auth" | "profile" => {
  if (value === "profile") return "profile";
  return "auth";
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const source = getSafeSource(searchParams.get("source"));

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validating, setValidating] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordError = useMemo(() => {
    if (password.length === 0) return "";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 128) return "Password cannot exceed 128 characters";
    return "";
  }, [password]);

  const confirmError = useMemo(() => {
    if (confirmPassword.length === 0) return "";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  }, [confirmPassword, password]);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setTokenError("Invalid or expired reset token.");
        setValidating(false);
        return;
      }

      try {
        await validatePasswordResetToken(token);
        setTokenError("");
      } catch (err) {
        setTokenError(errorHandler(err).message);
      } finally {
        setValidating(false);
      }
    };

    run();
  }, [token]);

  const canSubmit =
    token.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    passwordError.length === 0 &&
    confirmError.length === 0 &&
    !loading &&
    !validating &&
    tokenError.length === 0;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);

    try {
      await completePasswordReset({
        token,
        password,
        confirmPassword,
        source,
      });

      setError("");
      setSuccess(
        source === "profile"
          ? "Password updated successfully. Your current session remains active."
          : "Password updated successfully. Redirecting to sign in...",
      );

      if (source === "auth") {
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      }
    } catch (err) {
      setError(errorHandler(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {validating && (
        <p className="text-xs text-secondary-normal font-bold lg:text-sm">
          Validating reset link...
        </p>
      )}

      {!validating && tokenError.length !== 0 && (
        <p className="text-xs text-reject-normal font-bold lg:text-sm">
          {tokenError}
        </p>
      )}

      {!validating && tokenError.length === 0 && (
        <>
          <div>
            <label className="block text-xs lg:text-sm text-secondary-normal mb-1 font-semibold">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
              placeholder="Enter new password"
            />
            {passwordError.length !== 0 && (
              <p className="text-xs text-reject-normal font-bold mt-1">
                {passwordError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs lg:text-sm text-secondary-normal mb-1 font-semibold">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-base"
              placeholder="Confirm new password"
            />
            {confirmError.length !== 0 && (
              <p className="text-xs text-reject-normal font-bold mt-1">
                {confirmError}
              </p>
            )}
          </div>

          {error.length !== 0 && (
            <p className="text-xs text-reject-normal font-bold lg:text-sm">
              {error}
            </p>
          )}

          {success.length !== 0 && (
            <p className="text-xs text-success-normal font-bold lg:text-sm">
              {success}
            </p>
          )}

          {source === "profile" && success.length !== 0 && (
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="w-full py-[0.75rem] border border-secondary-normal/30 rounded-xl text-secondary-normal font-bold"
            >
              Back to Profile
            </button>
          )}

          <ButtonLoadingStopper loading={loading}>
            <PrimaryButton type="submit" disabled={!canSubmit}>
              <span className="font-bold lg:text-base lg:py-[0.5rem]">
                Update Password
              </span>
            </PrimaryButton>
          </ButtonLoadingStopper>
        </>
      )}
    </form>
  );
}

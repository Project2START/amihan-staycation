"use client";

import { useState } from "react";
import ButtonLoadingStopper from "@/app/shared/components/ButtonLoadingStopper";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import { requestPasswordReset } from "@/app/shared/api/passwordReset";

type PasswordResetRequestFormProps = {
  initialEmail?: string;
  lockEmail?: boolean;
  source: "auth" | "profile";
  onSuccess?: () => void;
};

export default function PasswordResetRequestForm({
  initialEmail = "",
  lockEmail = false,
  source,
  onSuccess,
}: PasswordResetRequestFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await requestPasswordReset({ email, source });
      setError("");
      setSuccess(result.message);
      onSuccess?.();
    } catch (err) {
      setError(errorHandler(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs lg:text-sm text-secondary-normal mb-1 font-semibold">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="input-base"
          disabled={loading || lockEmail}
        />
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

      <ButtonLoadingStopper loading={loading}>
        <PrimaryButton type="submit" disabled={loading || email.length === 0}>
          <span className="font-bold lg:text-base lg:py-[0.5rem]">
            Send Reset Link
          </span>
        </PrimaryButton>
      </ButtonLoadingStopper>
    </form>
  );
}

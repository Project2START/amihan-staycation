"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AlternativeSeparator from "@/app/shared/components/AlternativeSeparator";
import ButtonLoadingStopper from "@/app/shared/components/ButtonLoadingStopper";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import GoogleSignOption from "../../../shared/components/GoogleSignOption";
import { SignupSchema, signupSchema } from "../lib/signUpSchema";
import { signUp } from "../api/signUp";

const getSafeRedirectPath = (path: string | null) => {
  if (!path) return null;
  if (!path.startsWith("/")) return null;
  if (path.startsWith("//")) return null;

  return path;
};

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowCP] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));
  const verifyCodeHref = redirectPath
    ? `/verify-code?redirect=${encodeURIComponent(redirectPath)}`
    : "/verify-code";
  const signInHref = redirectPath
    ? `/sign-in?redirect=${encodeURIComponent(redirectPath)}`
    : "/sign-in";

  const onSubmit = async (data: SignupSchema) => {
    const { confirmPassword, ...rest } = data;

    setLoading(true);

    try {
      await signUp(rest);
      setError("");
      localStorage.setItem(
        "registree_client_resendCountdown",
        JSON.stringify(new Date(Date.now() + 30 * 1000)),
      );
      router.push(verifyCodeHref);
    } catch (error) {
      const errMessage = errorHandler(error);
      setError(errMessage.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[2rem] lg:mt-[1rem]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              {...register("firstName")}
              type="text"
              placeholder="First Name"
              className="input-base"
              aria-describedby={
                errors.firstName ? "firstName-error" : undefined
              }
            />
            {errors.firstName && (
              <p
                className="text-red-900 text-[0.65rem] lg:text-sm"
                id="firstName-error"
              >
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last Name"
              className="input-base"
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p
                className="text-red-900 text-[0.65rem] lg:text-sm"
                id="lastName-error"
              >
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <input
              {...register("email")}
              type="text"
              placeholder="Email"
              className="input-base"
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p
                className="text-red-900 text-[0.65rem] lg:text-sm"
                id="email-error"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-base"
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
              />
              <div className="absolute right-[0.5rem] top-[50%] translate-y-[-50%]">
                <Button
                  variant="text"
                  sx={{ minWidth: "0" }}
                  onClick={() => setShowPassword((password) => !password)}
                  aria-label="toggle password visibility"
                >
                  <span className="text-secondary-normal">
                    {showPassword ? (
                      <VisibilityIcon data-testid="password-visible" />
                    ) : (
                      <VisibilityOffIcon data-testid="password-hidden" />
                    )}
                  </span>
                </Button>
              </div>
            </div>
            {errors.password && (
              <p
                className="text-red-900 text-[0.65rem] lg:text-sm"
                id="password-error"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <div className="relative">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="input-base"
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
              />
              <div className="absolute right-[0.5rem] top-[50%] translate-y-[-50%]">
                <Button
                  variant="text"
                  sx={{ minWidth: "0" }}
                  onClick={() => setShowCP((password) => !password)}
                  aria-label="toggle confirm password visibility"
                >
                  <span className="text-secondary-normal">
                    {showConfirmPassword ? (
                      <VisibilityIcon data-testid="confirmPassword-visible" />
                    ) : (
                      <VisibilityOffIcon data-testid="confirmPassword-hidden" />
                    )}
                  </span>
                </Button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p
                className="text-red-900 text-[0.65rem] lg:text-sm"
                id="confirmPassword-error"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="col-span-2 mt-[0.25rem] lg:mt-[0.75rem]">
            {error.length !== 0 && (
              <p className="text-xs text-center mb-[0.5rem] text-red-900 font-bold lg:text-sm">
                {error}
              </p>
            )}
            <ButtonLoadingStopper loading={loading}>
              <PrimaryButton type="submit" disabled={loading ? true : false}>
                <span className="font-bold lg:text-base lg:py-[0.5rem]">
                  Sign Up
                </span>
              </PrimaryButton>
            </ButtonLoadingStopper>
          </div>
          <div className="col-span-2">
            <Link href={signInHref} className="text-center block">
              <span className="text-xs text-secondary-normal font-bold underline lg:text-sm">
                Already have an account?
              </span>
            </Link>
          </div>

          <div className="col-span-2 mt-[0.25rem]">
            <div className="py-[0.5rem] lg:py-[1rem]">
              <AlternativeSeparator />
            </div>
            <GoogleSignOption redirectPath={redirectPath} />
          </div>
        </div>
      </form>
    </div>
  );
}

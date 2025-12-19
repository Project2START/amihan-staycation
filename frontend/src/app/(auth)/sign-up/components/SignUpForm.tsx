"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import PrimaryButton from "@/app/shared/ui/PrimaryButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AlternativeSeparator from "@/app/shared/components/AlternativeSeparator";
import ButtonLoadingStopper from "@/app/shared/components/ButtonLoadingStopper";
import { errorHandler } from "@/app/shared/lib/errorHandler";
import GoogleSignOption from "../../../shared/components/GoogleSignOption";
import { SignupSchema, signupSchema } from "../lib/signUpSchema";
import { signUp } from "../api/signUp";

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

  const onSubmit = async (data: SignupSchema) => {
    const { confirmPassword, ...rest } = data;

    setLoading(true);

    try {
      await signUp(rest);
      setError("");
      router.push("/verify-code");
    } catch (error) {
      const errMessage = errorHandler(error);
      setError(errMessage.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-sm mt-[2rem]">
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
              <p className="text-red-900 text-[0.65rem]" id="firstName-error">
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
              <p className="text-red-900 text-[0.65rem]" id="lastName-error">
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
              <p className="text-red-900 text-[0.65rem]" id="email-error">
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
              <p className="text-red-900 text-[0.65rem]" id="password-error">
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
                className="text-red-900 text-[0.65rem]"
                id="confirmPassword-error"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="col-span-2 mt-[0.25rem]">
            {error.length !== 0 && (
              <p className="text-xs text-center mb-[0.5rem] text-red-900 font-bold">
                {error}
              </p>
            )}
            <ButtonLoadingStopper loading={loading}>
              <PrimaryButton type="submit" disabled={loading ? true : false}>
                Sign Up
              </PrimaryButton>
            </ButtonLoadingStopper>
          </div>
          <div className="col-span-2">
            <Link href={"/sign-in"} className="text-center block">
              <span className="text-xs text-secondary-normal font-bold underline">
                Already have an account?
              </span>
            </Link>
          </div>

          <div className="col-span-2 mt-[0.85rem]">
            <AlternativeSeparator />
            <GoogleSignOption />
          </div>
        </div>
      </form>
    </div>
  );
}

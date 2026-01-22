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
import { signInSchema, SignInSchema } from "../lib/signInSchema";
import { signIn } from "../api/signIn";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const onSubmit = async (data: SignInSchema) => {
    setLoading(true);

    try {
      await signIn(data);
      setError("");
      router.push("/dashboard");
    } catch (error) {
      setError(errorHandler(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-[2rem] lg:mt-[1rem]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 ">
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
          <div className="col-span-2 mt-[0.25rem]">
            {error.length !== 0 && (
              <p className="text-xs text-center mb-[0.5rem] text-red-900 font-bold">
                {error}
              </p>
            )}
            <ButtonLoadingStopper loading={loading}>
              <PrimaryButton type="submit" disabled={loading ? true : false}>
                <span className="font-bold lg:text-base lg:py-[0.5rem]">
                  Sign In
                </span>
              </PrimaryButton>
            </ButtonLoadingStopper>
          </div>
          <div className="col-span-2">
            <div className="flex justify-center">
              <Link href={"/log-in"} className="w-max text-center block">
                <span className="text-xs text-secondary-normal lg:text-sm">
                  Forgot password?
                </span>
              </Link>
            </div>
          </div>

          <div className="col-span-2 mt-[0.85rem] border-b-1 border-tertiary-normal/30 pb-[1rem]">
            <AlternativeSeparator />
            <div className="py-[0.5rem] lg:py-[1rem]">
              <GoogleSignOption />
            </div>
          </div>

          <div className="col-span-2">
            <div className="flex justify-center">
              <Link
                href={"/sign-up"}
                className="w-max text-center block p-[0.5rem] rounded-lg"
              >
                <span className="text-xs text-secondary-normal font-bold underline lg:text-sm">
                  Create new account
                </span>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { authValidationSchema, SchemaType } from "../utils/authValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import PrimaryButton from "@/app/ui/PrimaryButton";
import Link from "next/link";

const fields = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
];

const schema = authValidationSchema(fields);

type FormData = SchemaType<typeof schema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowCP] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...rest } = data;
    console.log(rest);
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
            />
            {errors.firstName && (
              <p className="text-red-900 text-[0.65rem]">
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
            />
            {errors.lastName && (
              <p className="text-red-900 text-[0.65rem]">
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
            />
            {errors.email && (
              <p className="text-red-900 text-[0.65rem]">
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
              />
              <div className="absolute right-[0.5rem] top-[50%] translate-y-[-50%]">
                <Button
                  variant="text"
                  sx={{ minWidth: "0" }}
                  onClick={() => setShowPassword((password) => !password)}
                >
                  <span className="text-secondary-normal">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </span>
                </Button>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-900 text-[0.65rem]">
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
              />
              <div className="absolute right-[0.5rem] top-[50%] translate-y-[-50%]">
                <Button
                  variant="text"
                  sx={{ minWidth: "0" }}
                  onClick={() => setShowCP((password) => !password)}
                >
                  <span className="text-secondary-normal">
                    {showConfirmPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </span>
                </Button>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-900 text-[0.65rem]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="col-span-2 mt-[1rem]">
            <PrimaryButton type="submit">Sign Up</PrimaryButton>
          </div>
          <div className="col-span-2">
            <Link href={"/log-in"} className="text-center block">
              <span className="text-xs text-secondary-normal">
                Already have an account?
              </span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

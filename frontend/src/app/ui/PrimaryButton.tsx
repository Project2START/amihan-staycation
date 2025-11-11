"use client";

import { Button, ButtonProps } from "@mui/material";
import React from "react";

type PrimaryButtonProps = {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  children?: React.ReactNode;
  variant?: ButtonProps["variant"]; // <-- automatically "text" | "outlined" | "contained"
  style?: React.CSSProperties;
  onClick?: () => void;
};

export default function PrimaryButton({
  onClick,
  type = "button",
  children,
  variant = "contained",
  style = {},
}: PrimaryButtonProps) {
  return (
    <Button
      onClick={onClick}
      fullWidth
      type={type}
      variant={variant}
      sx={{
        backgroundColor: "var(--color-primary-normal)",
        textTransform: "capitalize",
        borderRadius: "0.75rem",
        padding: "0.75rem",
        ...style,
      }}
    >
      {children}
    </Button>
  );
}

"use client";

import { Alert } from "@mui/material";
import toast, { ToastOptions } from "react-hot-toast";
import React from "react";

type Indicator = "success" | "error" | "info";

interface CustomToastOptions extends ToastOptions {
  indicator?: Indicator; // choose success/reject/normal
  textColor?: string; // defaults to white
  alertStyle?: React.CSSProperties; // width, height, padding, etc.
}

export const CustomToast = {
  show: (message: React.ReactNode | string, options?: CustomToastOptions) => {
    const {
      indicator = "info",
      textColor = "#fff",
      alertStyle = {},
      ...rest
    } = options || {};

    // Map indicator to CSS variable
    const bgColor = (() => {
      switch (indicator) {
        case "success":
          return "var(--color-success-normal)";
        case "error":
          return "var(--color-reject-normal)";
        case "info":
        default:
          return "#ffffff";
      }
    })();

    const defaultTextColor = indicator === "info" ? "#000000" : textColor;

    return toast(
      <Alert
        severity={indicator}
        variant="filled"
        sx={{
          backgroundColor: bgColor,
          color: defaultTextColor,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          ...alertStyle,
        }}
      >
        {message}
      </Alert>,
      {
        duration: 3000,
        style: {
          margin: 0,
          padding: 0,
          background: "none",
          boxShadow: "none",
        },
        ...rest,
      },
    );
  },
};

"use client";

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
}) => {
  return (
    <div className="relative">
      {/* Children dimmed when loading */}

      {children}

      {/* Spinner centered */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <CircularProgress
            size={24}
            sx={{ color: "var(--color-secondary-normal)" }}
          />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;

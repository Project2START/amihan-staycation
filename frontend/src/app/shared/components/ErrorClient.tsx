"use client";

import ErrorIcon from "@mui/icons-material/Error";

export default function ErrorClient({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-secondary-normal p-6">
      <ErrorIcon className="text-gray-500 opacity-70" fontSize="large" />

      <h2 className="text-lg font-semibold mt-2 opacity-70">{title}</h2>

      {message && (
        <p className="mt-2 text-sm text-gray-500 text-center max-w-xl opacity-70">
          {message}
        </p>
      )}

      {onRetry && (
        <div className="mt-4">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded hover:opacity-95 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

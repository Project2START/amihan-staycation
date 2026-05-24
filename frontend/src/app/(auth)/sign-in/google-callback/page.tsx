"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const getSafeRedirectPath = (path: string | null) => {
  if (!path) return "/auth";
  if (!path.startsWith("/")) return "/auth";
  if (path.startsWith("//")) return "/auth";
  return path;
};

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = getSafeRedirectPath(searchParams.get("redirect"));
  const oauthToken = searchParams.get("token");

  useEffect(() => {
    const syncCookiesAndRedirect = async () => {
      try {
        if (!oauthToken) {
          throw new Error("Missing OAuth token");
        }

        const response = await fetch("/api/auth/google-callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: oauthToken }),
        });

        if (!response.ok) {
          throw new Error("Unable to finalize Google sign-in");
        }

        router.replace(redirectPath);
      } catch {
        router.replace(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
      }
    };

    void syncCookiesAndRedirect();
  }, [oauthToken, redirectPath, router]);

  return (
    <div className="px-[2rem] py-[6rem] text-center text-secondary-normal">
      <p className="text-sm lg:text-base">Finalizing Google sign-in...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense>
      <GoogleCallbackInner />
    </Suspense>
  );
}

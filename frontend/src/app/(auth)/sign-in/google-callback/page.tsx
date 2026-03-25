"use client";

import { HOST } from "@/app/shared/constants/config";
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

  useEffect(() => {
    const syncCookiesAndRedirect = async () => {
      try {
        const meResponse = await fetch(`${HOST}/api/users/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!meResponse.ok) {
          throw new Error("Unable to fetch authenticated user session");
        }

        const payload = await meResponse.json();
        const user = payload?.user;

        if (!user?.id || !user?.role) {
          throw new Error("Missing user id or role");
        }

        await fetch("/api/auth/register-cookies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.id, role: user.role }),
        });

        router.replace(redirectPath);
      } catch {
        router.replace(`/sign-in?redirect=${encodeURIComponent(redirectPath)}`);
      }
    };

    void syncCookiesAndRedirect();
  }, [redirectPath, router]);

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

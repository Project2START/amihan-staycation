"use client";

import { useEffect } from "react";
import { fetchUser } from "@/lib/features/users/usersThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Skeleton from "@mui/material/Skeleton";
import NotFoundClient from "@/app/shared/components/NotFoundClient";
import { setLoading } from "@/lib/features/users/usersSlice";

export default function RoleGuard({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | undefined;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users);

  useEffect(() => {
    if (!userId) {
      dispatch(setLoading({ loading: false }));
      return;
    }

    if (user.data?.id === userId) return;

    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (user.loading) {
    return (
      <>
        <div className="lg:hidden">
          <div className="flex items-center justify-center p-[1rem]">
            <Skeleton variant="circular" width={40} height={40} />
          </div>
          <div className="p-[1.5rem]">
            <Skeleton
              variant="rounded"
              sx={{ width: "100%", height: "3.5rem" }}
            />
            <div className="flex flex-col gap-y-3 mt-[2.5rem]">
              <Skeleton
                variant="rounded"
                sx={{ width: "100%", height: "10rem" }}
              />
              <Skeleton
                variant="rounded"
                sx={{ width: "100%", height: "10rem" }}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="flex items-center gap-8 px-[3rem] py-[1.25rem] w-full">
            {/* Logo skeleton */}
            <Skeleton variant="circular" width={48} height={48} />

            {/* Nav skeleton */}
            <div className="flex-1 flex justify-center gap-6">
              <Skeleton variant="rounded" width={90} height={32} />
              <Skeleton variant="rounded" width={90} height={32} />
            </div>

            {/* Notification bell */}
            <Skeleton variant="circular" width={36} height={36} />

            {/* Profile avatar */}
            <Skeleton variant="circular" width={44} height={44} />
          </div>
          {/* Skeleton unit cards, matching units/page.tsx fallback */}
          <div className="my-[1rem] grid gap-y-8 max-w-3xl mx-auto">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="grid gap-y-5" key={i}>
                <Skeleton variant="rounded" animation="wave" height={200} />
                <Skeleton variant="rounded" animation="wave" height={30} />
                <Skeleton variant="rounded" animation="wave" height={60} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (user.error) {
    return <NotFoundClient />;
  }

  return <>{children}</>;
}

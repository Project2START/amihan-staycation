"use client";

import { useEffect } from "react";
import { fetchUser } from "@/lib/features/users/usersThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Skeleton from "@mui/material/Skeleton";
import NotFoundError from "../components/NotFoundError";

export default function ProtectedPagesGuard({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | undefined;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users);

  if (!userId) {
    return <NotFoundError />;
  }

  useEffect(() => {
    if (!userId) return;

    if (user.data?.id === userId) return;

    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (user.loading) {
    return (
      <div>
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

        <div className="hidden lg:block lg:mx-auto lg:w-full lg:max-w-[1280px] lg:py-[2rem]">
          <div className="min-h-screen lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6 lg:items-start">
            <aside className="lg:flex lg:flex-col lg:gap-4">
              <div className="rounded-xl border border-secondary-normal/10 bg-white p-5 shadow-sm">
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={18}
                  width="50%"
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={40}
                  width="35%"
                />
              </div>

              <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={16}
                  width="55%"
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={18}
                  width="90%"
                />
              </div>

              <div className="rounded-xl border border-secondary-normal/10 bg-white p-4 shadow-sm">
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={16}
                  width="55%"
                />
                <Skeleton
                  variant="text"
                  animation="wave"
                  height={18}
                  width="90%"
                />
              </div>
            </aside>

            <div className="grid gap-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  className="grid gap-y-4 rounded-2xl border border-secondary-normal/10 bg-white px-6 py-6 shadow-sm"
                  key={i}
                >
                  <Skeleton variant="rounded" animation="wave" height={260} />
                  <Skeleton variant="rounded" animation="wave" height={30} />
                  <Skeleton variant="rounded" animation="wave" height={60} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.error) {
    return <NotFoundError />;
  }

  return <>{children}</>;
}

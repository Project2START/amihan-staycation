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
      <div>
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
    );
  }

  if (user.error) {
    return <NotFoundClient />;
  }

  return <>{children}</>;
}

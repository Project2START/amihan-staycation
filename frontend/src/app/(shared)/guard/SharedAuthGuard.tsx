"use client";

import { useEffect } from "react";
import { fetchUser } from "@/lib/features/users/usersThunks";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Skeleton from "@mui/material/Skeleton";
import { setLoading } from "@/lib/features/users/usersSlice";

export default function SharedAuthGuard({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | undefined;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users);

  // Shared pages should remain visible to guests.
  if (!userId) {
    return <>{children}</>;
  }

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
      <div className="p-[1.5rem]">
        <Skeleton variant="rounded" sx={{ width: "100%", height: "3.5rem" }} />
        <div className="flex flex-col gap-y-3 mt-[2.5rem]">
          <Skeleton variant="rounded" sx={{ width: "100%", height: "10rem" }} />
        </div>
      </div>
    );
  }

  if (user.error || !user.data) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

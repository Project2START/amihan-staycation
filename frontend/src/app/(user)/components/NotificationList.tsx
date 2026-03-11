"use client";

import { useEffect, useRef, useState } from "react";
import NotificationItem, { INotificationItem } from "./NotificationItem";
import { useAppSelector } from "@/lib/hooks";
import axios from "axios";
import { HOST } from "@/app/shared/constants/config";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

export default function NotificationList({
  handleCloseNotif,
}: {
  handleCloseNotif: () => void;
}) {
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);
  const [moreLoading, setMoreLoading] = useState(false);
  const [noMoreView, setNoMoreView] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const user = useAppSelector((state) => state.users.data);

  useEffect(() => {
    if (!user?.id) return;

    const handleWait = async () => {
      setMoreLoading(true);
      setHasError(false);

      try {
        const result = await axios.get<{
          message: string;
          notifications: INotificationItem[];
        }>(
          `${HOST}/api/notifications?userDestinationId=${user?.id}&skip=${skip}&take=${10}`,
          { withCredentials: true },
        );

        if (result.data.notifications.length === 0) {
          setNoMoreView(true);
        }

        setNotifications((prev) => {
          const merged = [...prev, ...result.data.notifications];
          const uniqueById = new Map<string, INotificationItem>();

          for (const item of merged) {
            uniqueById.set(item.id, item);
          }

          return Array.from(uniqueById.values());
        });

        await axios.patch(
          `${HOST}/api/notifications`,
          {
            identifier: { userDestinationId: user?.id },
            data: { hasRead: true },
          },
          { withCredentials: true },
        );
      } catch (err) {
        console.error(err);
        setHasError(true);
      } finally {
        setMoreLoading(false);
      }
    };

    handleWait();
  }, [skip, retryKey, user?.id]);

  if (hasError && notifications.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        gap={2}
      >
        <Typography variant="body1" color="text.secondary">
          Something went wrong
        </Typography>
        <Button
          type="button"
          size="small"
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            setRetryKey((prev) => prev + 1);
          }}
          style={{ backgroundColor: "var(--color-primary-normal)" }}
        >
          <span className="capitalize text-xs block p-1">Try Again</span>
        </Button>
      </Box>
    );
  }

  if (notifications.length === 0 && !moreLoading) {
    return (
      <div className="flex items-center justify-center h-full ">
        <p className="text-sm font-bold text-gray-300">
          No notifications as of the moment
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          handleCloseNotif={handleCloseNotif}
        />
      ))}

      <div className="flex justify-center">
        {moreLoading && !noMoreView && (
          <div className="mt-[0.5rem]">
            <span>
              <CircularProgress
                size={18}
                sx={{ color: "var(--color-secondary-normal)" }}
              />
            </span>
          </div>
        )}

        {!noMoreView && notifications.length >= 10 && !moreLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSkip((skip) => skip + 10);
            }}
          >
            <span className="text-secondary-normal font-bold text-xs underline">
              View more
            </span>
          </button>
        )}

        {noMoreView && (
          <p className="text-xs font-bold text-gray-300 text-center  pt-[0.5rem] mt-[0.5rem]">
            You reach the end
          </p>
        )}
      </div>

      {hasError && notifications.length > 0 ? (
        <div className="flex justify-center py-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRetryKey((prev) => prev + 1);
            }}
          >
            <span className="text-reject-normal font-bold text-xs underline">
              Retry loading notifications
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

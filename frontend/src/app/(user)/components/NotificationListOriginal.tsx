"use client";

import { HOST } from "@/app/shared/constants/config";
import Skeleton from "@mui/material/Skeleton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import useSWR from "swr";
import NotificationItem, { INotificationItem } from "./NotificationItem";
import { useAppSelector } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export default function NotificationListOriginal() {
  const [skip, setSkip] = useState(0);
  const [notifications, setNotifications] = useState<INotificationItem[]>([]);

  const user = useAppSelector((state) => state.users.data);

  const hasMarked = useRef(false);

  const { data, error, isLoading, mutate } = useSWR<{
    message: string;
    notifications: INotificationItem[];
  }>(
    user?.id
      ? `${HOST}/api/notifications?userDestinationId=${user.id}&skip=${skip}&take=${10}`
      : null,
    fetcher,
  );

  useEffect(() => {
    if (!data?.notifications) return;

    setNotifications((prev) => {
      const merged = [...prev, ...data.notifications];
      const uniqueById = new Map<string, INotificationItem>();

      for (const item of merged) {
        uniqueById.set(item.id, item);
      }

      return Array.from(uniqueById.values());
    });
  }, [data?.notifications]);

  useEffect(() => {
    if (!user?.id) return;
    if (!data?.notifications?.length) return;
    if (hasMarked.current) return;

    hasMarked.current = true;

    const handleUpdateNotif = async () => {
      try {
        await axios.patch(
          `${HOST}/api/notifications`,
          {
            identifier: { userDestinationId: user?.id },
            data: { hasRead: true },
          },
          { withCredentials: true },
        );
      } catch (error) {
        console.error(error);
      }
    };

    handleUpdateNotif();
  }, [data, user?.id]);

  // if (isLoading) {
  //   return (
  //     <List>
  //       {Array.from({ length: 4 }).map((_, i) => (
  //         <ListItem key={i} alignItems="flex-start">
  //           <ListItemAvatar>
  //             <Skeleton variant="circular" width={40} height={40} />
  //           </ListItemAvatar>
  //           <ListItemText
  //             primary={<Skeleton variant="text" width="40%" />}
  //             secondary={<Skeleton variant="text" width="80%" />}
  //           />
  //         </ListItem>
  //       ))}
  //     </List>
  //   );
  // }

  if (error) {
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
            mutate();
          }}
          style={{ backgroundColor: "var(--color-primary-normal)" }}
        >
          <span className="capitalize text-xs block p-1">Try Again</span>
        </Button>
      </Box>
    );
  }

  // const notifications = data?.notifications ?? [];

  if (notifications.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Typography variant="body2" color="text.secondary">
          No notifications yet
        </Typography>
      </Box>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}

      <div className="flex justify-center">
        {isLoading ? (
          <div className="mt-[0.5rem]">
            <span>
              <CircularProgress
                size={18}
                sx={{ color: "var(--color-secondary-normal)" }}
              />
            </span>
          </div>
        ) : (
          data?.notifications.length !== 0 && (
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
          )
        )}
      </div>
    </div>
  );
}

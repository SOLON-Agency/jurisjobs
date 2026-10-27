"use client";

import React, { useState } from "react";
import {
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  type SxProps,
  type Theme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNotifications } from "@/hooks/useNotifications";
import { timeAgo } from "@/lib/utils";
import { JJIconButton } from "@/components/common/JJIconButton";
import { JJButton } from "@/components/common/JJButton";

export interface JJNotificationBellProps {
  sx?: SxProps<Theme>;
}

export function JJNotificationBell({ sx }: JJNotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const unread = notifications.filter((n) => !n.read_at);

  return (
    <>
      <JJIconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        size="small"
        aria-label={unreadCount > 0 ? `Notificări (${unreadCount} necitite)` : "Notificări"}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        sx={sx}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </JJIconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { width: 360, maxHeight: 480, overflow: "auto" },
          },
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">Notificări</Typography>
          {unread.length > 0 && (
            <JJButton appearance="secondary" size="small" onClick={markAllAsRead}>
              Marchează toate ca citite
            </JJButton>
          )}
        </Box>
        <Divider />
        {unread.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Nicio notificare necitită
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {unread.map((n) => (
              <ListItem
                key={n.id}
                onClick={() => markAsRead(n.id)}
                sx={{
                  cursor: "pointer",
                  bgcolor: "action.hover",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <ListItemText
                  primary={n.title}
                  secondary={
                    <>
                      {n.body && (
                        <Typography variant="caption" color="text.secondary" component="span">
                          {n.body}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" component="span" sx={{ display: "block" }}>
                        {timeAgo(n.created_at)}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    variant: "body2",
                    fontWeight: 600,
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
}

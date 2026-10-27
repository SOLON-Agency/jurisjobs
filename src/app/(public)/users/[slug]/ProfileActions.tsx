"use client";

import React from "react";
import { Stack, Tooltip } from "@mui/material";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import { JJButton } from "@/components/common/JJButton";
import { JJIconButton } from "@/components/common/JJIconButton";

interface ProfileActionsProps {
  cvDownloadUrl?: string | null;
}

export function ProfileActions({ cvDownloadUrl }: ProfileActionsProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexShrink: 0, pt: 1.5 }}>
      {/* Share — full label on md+, icon-only on mobile */}
      <JJButton
        variant="outlined"
        appearance="secondary"
        size="medium"
        startIcon={<ShareOutlinedIcon sx={{ fontSize: "16px !important" }} />}
        sx={{
          fontWeight: 700,
          display: { xs: "none", md: "inline-flex" },
        }}
        aria-label="Trimite"
      >
        Trimite
      </JJButton>
      <Tooltip title="Trimite">
        <JJIconButton
          size="medium"
          aria-label="Trimite"
          sx={{
            minWidth: 0,
            px: 1.5,
            border: "1px solid",
            borderColor: "divider",
            display: { xs: "inline-flex", md: "none" },
          }}
        >
          <ShareOutlinedIcon fontSize="small" />
        </JJIconButton>
      </Tooltip>

      {/* CV download */}
      {cvDownloadUrl && (
        <>
          <JJButton
            component="a"
            href={cvDownloadUrl}
            download
            variant="contained"
            appearance="primary"
            size="medium"
            endIcon={<DownloadIcon sx={{ fontSize: "16px !important" }} />}
            sx={{
              fontWeight: 700,
              bgcolor: "text.primary",
              color: "background.paper",
              "&:hover": { bgcolor: "text.secondary" },
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Descarcă CV
          </JJButton>
          <Tooltip title="Descarcă CV">
            <JJIconButton
              component="a"
              href={cvDownloadUrl}
              download
              size="medium"
              aria-label="Descarcă CV"
              sx={{
                minWidth: 0,
                px: 1.5,
                bgcolor: "text.primary",
                color: "background.paper",
                "&:hover": { bgcolor: "text.secondary" },
                display: { xs: "inline-flex", sm: "none" },
              }}
            >
              <DownloadIcon fontSize="small" />
            </JJIconButton>
          </Tooltip>
        </>
      )}
    </Stack>
  );
}

"use client";

import React, { forwardRef, useState } from "react";
import {
  InputAdornment,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { JJIconButton } from "@/components/common/JJIconButton";

export const JJPasswordField = forwardRef<HTMLDivElement, TextFieldProps>(
  function JJPasswordField({ InputProps, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextField
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <>
              {InputProps?.endAdornment}
              <InputAdornment position="end">
                <JJIconButton
                  aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  onMouseDown={(event) => event.preventDefault()}
                  edge="end"
                  size="small"
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </JJIconButton>
              </InputAdornment>
            </>
          ),
        }}
      />
    );
  },
);

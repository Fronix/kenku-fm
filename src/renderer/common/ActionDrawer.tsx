import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingsIcon from "@mui/icons-material/SettingsRounded";
import { Link, Stack, Toolbar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import React, { useRef, useState } from "react";
import { BookmarkListItems } from "../features/bookmarks/BookmarkListItems";
import { InputListItems } from "../features/input/InputListItems";
import { OutputListItems } from "../features/output/OutputListItems";
import { Settings } from "../features/settings/Settings";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";

import { setMenuState } from "../features/menu/menuSlice";
import { useHideScrollbar } from "./useHideScrollbar";

export const drawerWidth = 240;

export function ActionDrawer() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const connection = useSelector((state: RootState) => state.connection);
  const menu = useSelector((state: RootState) => state.menu);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hideScrollbar = useHideScrollbar(scrollRef);

  return (
    <Box
      component="nav"
      sx={{ width: menu.menuOpen ? drawerWidth : 0, flexShrink: 0 }}
    >
      <Drawer
        variant="persistent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            bgcolor: "background.default",
            overflowY: "initial",
          },
        }}
        open={menu.menuOpen}
      >
        <Toolbar
          sx={{
            justifyContent:
              window.kenku.platform === "win32" ? "space-between" : "end",
            bgcolor: "background.paper",
            px: 1,
            WebkitAppRegion: "drag",
            minHeight: "52px",
          }}
          disableGutters
          variant="dense"
          onDoubleClick={(e) =>
            e.target === e.currentTarget && window.kenku.toggleMaximize()
          }
        >
          {window.kenku.platform === "win32" && (
            <IconButton
              onClick={() => dispatch(setMenuState("closed"))}
              sx={{ WebkitAppRegion: "no-drag" }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => setSettingsOpen(true)}
            sx={{ WebkitAppRegion: "no-drag" }}
          >
            <SettingsIcon />
          </IconButton>
          <Settings
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        </Toolbar>
        <Box sx={{ overflowY: "auto" }} ref={scrollRef} {...hideScrollbar}>
          <Stack>
            <BookmarkListItems />
            {settings.externalInputsEnabled && <InputListItems />}
            <OutputListItems />
            {connection.status === "disconnected" && (
              <Typography variant="caption" align="center" marginY={2}>
                Connect{" "}
                <Link
                  component="button"
                  variant="caption"
                  onClick={() => setSettingsOpen(true)}
                >
                  Discord
                </Link>{" "}
                for more outputs
              </Typography>
            )}
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

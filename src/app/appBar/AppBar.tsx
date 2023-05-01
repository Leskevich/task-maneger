import React from "react";
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useAppSelector } from "../store";
import { selectIsLoggedIn } from "../../features/Login";
import { useActions } from "../../common/hooks";
import { authThunk } from "../../features/Login/auth-reducer";
import { selectStatus } from "../select";

export const AppHeaderBar = () => {
  const { logout } = useActions(authThunk);

  const status = useAppSelector(selectStatus);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const logoutHandler = () => {
    logout({});
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton>
        <Typography variant="h6">News</Typography>
        {isLoggedIn && (
          <Button color="inherit" onClick={logoutHandler}>
            Log out
          </Button>
        )}
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  );
};

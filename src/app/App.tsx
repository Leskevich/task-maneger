import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { ErrorSnackbar } from "common/components/ErrorSnackbar/ErrorSnackbar";
import { useAppSelector } from "./store";
import { appThunk } from "./app-reducer";
import { Navigate, Route, Routes } from "react-router-dom";

import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { Login } from "features/Login/Login";
import { authThunk } from "features/Login/auth-reducer";
import { selectIsInitialized, selectStatus } from "app";
import { selectIsLoggedIn } from "../features/Login";
import { useActions } from "../common/hooks";

type PropsType = {
  demo?: boolean;
};

function App({ demo = false }: PropsType) {
  const status = useAppSelector(selectStatus);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { logout, me } = useActions({ ...authThunk, ...appThunk });

  useEffect(() => {
    me({});
  }, []);

  const logoutHandler = () => {
    logout({});
  };

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorSnackbar />
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
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList demo={demo} />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"*"} element={<Navigate to={"/"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

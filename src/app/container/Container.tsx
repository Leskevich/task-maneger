import React, { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { TodolistsList } from "../../features/TodolistsList/TodolistsList";
import { Login } from "../../features/Login/Login";
import { Container } from "@mui/material";

type PropsType = {
  demo?: boolean;
};

export const AppContainer: FC<PropsType> = ({ demo }) => {
  return (
    <Container fixed>
      <Routes>
        <Route path={"/"} element={<TodolistsList demo={demo} />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"*"} element={<Navigate to={"/"} />} />
      </Routes>
    </Container>
  );
};

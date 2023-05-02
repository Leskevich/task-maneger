import React, { FC, useEffect } from "react";
import { useAppSelector } from "app/store";
import { thunkTodo } from "features/TodolistsList/todolist/todolists-reducer";
import { Grid, Paper } from "@mui/material";
import { Todolist } from "./todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useActions } from "common";
import { AddItemForm } from "common/components";
import { selectIsLoggedIn } from "../Login";
import { selectTodolists } from "./todolist/select";

type TProps = {
  demo?: boolean;
};

export const TodolistsList: FC<TProps> = ({ demo = false }) => {
  const todolists = useAppSelector(selectTodolists);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const { fetchTodolists, addTodo } = useActions(thunkTodo);

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    fetchTodolists({});
  }, []);

  const addTodolist = (title: string) => addTodo({ title }).unwrap();

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} demo={demo} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

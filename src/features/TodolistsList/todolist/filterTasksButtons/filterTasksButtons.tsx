import React, { FC, memo } from "react";
import { Button } from "@mui/material";
import { actionsTodo, FilterValuesType } from "features/TodolistsList/todolist/todolists-reducer";
import { useActions } from "common";

type Props = {
  todoID: string;
  todoFilter: FilterValuesType;
};
export const FilterTasksButtons: FC<Props> = memo(({ todoID, todoFilter }) => {
  const { changeTodolistFilter } = useActions(actionsTodo);
  const onFilterHandler = (filter: FilterValuesType) => changeTodolistFilter({ id: todoID, filter });
  return (
    <>
      <Button
        variant={todoFilter === "all" ? "outlined" : "text"}
        onClick={() => onFilterHandler("all")}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todoFilter === "active" ? "outlined" : "text"}
        onClick={() => onFilterHandler("active")}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todoFilter === "completed" ? "outlined" : "text"}
        onClick={() => onFilterHandler("completed")}
        color={"secondary"}
      >
        Completed
      </Button>
    </>
  );
});

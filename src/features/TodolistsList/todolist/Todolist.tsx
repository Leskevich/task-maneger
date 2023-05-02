import React, { FC, memo, useEffect } from "react";
import { TodolistDomainType } from "features/TodolistsList/todolist/todolists-reducer";
import { tasksThunks } from "features/TodolistsList/tasks/tasks-reducer";
import { useActions } from "common";
import { AddItemForm } from "common/components";
import { FilterTasksButtons } from "features/TodolistsList/todolist/filterTasksButtons/filterTasksButtons";
import { Tasks } from "features/TodolistsList/todolist/tasks/Tasks";
import { TitleTodolist } from "features/TodolistsList/todolist/titleTodolist/TitleTodolist";

type Props = {
  todolist: TodolistDomainType;
  demo?: boolean;
};

export const Todolist: FC<Props> = memo(function ({ demo = false, todolist }) {
  const { addTask, fetchTasks } = useActions(tasksThunks);

  useEffect(() => {
    if (demo) {
      return;
    }
    fetchTasks(todolist.id);
  }, []);

  const addTaskHandler = (title: string) => addTask({ taskTitle: title, todolistId: todolist.id }).unwrap();

  return (
    <div>
      <TitleTodolist todoID={todolist.id} todoTitle={todolist.title} todoEntityStatus={todolist.entityStatus} />
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <Tasks todoID={todolist.id} todoFilter={todolist.filter} />
      <div style={{ paddingTop: "10px" }}>
        <FilterTasksButtons todoID={todolist.id} todoFilter={todolist.filter} />
      </div>
    </div>
  );
});

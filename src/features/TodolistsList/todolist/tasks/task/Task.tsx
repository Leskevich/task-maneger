import React, { ChangeEvent, FC, memo } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "features/TodolistsList/tasks/tasks-reducer";
import { useActions } from "common";
import { EditableSpan } from "common/components";
import { TaskStatuses } from "common/commonType";
import { TTask } from "features/TodolistsList/tasks/taskAPI";

type Props = {
  task: TTask;
  todolistId: string;
};
export const Task: FC<Props> = memo(({ task, todolistId }) => {
  const { removeTask, updateTask } = useActions(tasksThunks);

  const onClickHandler = () => removeTask({ taskId: task.id, todolistId: todolistId });

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New;
    updateTask({ taskId: task.id, todolistId: todolistId, domainModel: { status: newIsDoneValue } });
  };

  const onTitleChangeHandler = (newValue: string) => {
    updateTask({ taskId: task.id, domainModel: { title: newValue }, todolistId: todolistId });
  };

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />
      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});

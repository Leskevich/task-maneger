import React, {FC, memo} from 'react';
import {Task} from "features/TodolistsList/todolist/tasks/task/Task";
import {TaskStatuses} from "common/commonType";
import {useSelector} from "react-redux";
import {AppRootStateType} from "app/store";
import {TTask} from "features/TodolistsList/tasks/taskAPI";
import {FilterValuesType} from "features/TodolistsList/todolist/todolists-reducer";

type  Props = {
    todoID: string
    todoFilter: FilterValuesType
}
export const Tasks: FC<Props> = memo(({todoID, todoFilter}) => {
    const tasks = useSelector<AppRootStateType, Array<TTask>>(state => state.tasks[todoID])
    const tasksForTodolist = () => {
        switch (todoFilter) {
            case 'active':
                return tasks.filter(t => t.status === TaskStatuses.New)
            case 'completed':
                return tasks.filter(t => t.status === TaskStatuses.Completed)
            default:
                return tasks
        }
    }
    return (
        <>{tasksForTodolist().map(t => <Task key={t.id} task={t} todolistId={todoID}/>)}</>
    );
});

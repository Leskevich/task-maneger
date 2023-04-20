import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {tasksThunks} from "features/TodolistsList/tasks-reducer";
import {useAppDispatch} from "common/hooks";
import {EditableSpan} from "common/components";


type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
    const {task, todolistId} = props
    const dispatch = useAppDispatch()

    const onClickHandler = useCallback(() => dispatch(tasksThunks.removeTask({
        taskId: task.id,
        todolistId: todolistId
    })), [task.id, todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(tasksThunks.updateTask({
            taskId: task.id,
            todolistId: todolistId,
            domainModel: {status: newIsDoneValue}
        }))
    }, [task.id, todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(tasksThunks.updateTask({
            taskId: task.id,
            domainModel: {title: newValue},
            todolistId: todolistId
        }))
    }, [task.id, todolistId]);

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})

import React, {FC, memo} from 'react';
import {EditableSpan} from "common/components";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useActions} from "common/hooks";
import {thunkTodo} from "features/TodolistsList/todolist/todolists-reducer";
import {RequestStatusType} from "app/app-reducer";

type Props = {
    todoID: string
    todoTitle: string
    todoEntityStatus: RequestStatusType
}
export const TitleTodolist: FC<Props> = memo(({todoID, todoTitle, todoEntityStatus}) => {
    const {changeTitleTodo, removeTodo} = useActions(thunkTodo)
    const removeTodolist = () => removeTodo({id: todoID})
    const changeTodolistTitle = (title: string) => changeTitleTodo({todolistId: todoID, title})
    return (
        <h3><EditableSpan value={todoTitle} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={todoEntityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
    );
});

import React, {useCallback, useEffect} from 'react'
import {Task} from './Task/Task'
import {FilterValuesType, thunkTodo, TodolistDomainType} from '../todolists-reducer'
import {tasksThunks} from '../tasks-reducer'
import {Button, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {useAppDispatch} from "common/hooks";
import {AddItemForm, EditableSpan} from "common/components";
import {TTask} from "features/TodolistsList/todolistsAPI";
import { TaskStatuses } from 'common/commonType'

type PropsType = {
    todolist: TodolistDomainType
    tasks: Array<TTask>
    changeFilter: (value: FilterValuesType, todolistId: string) => void

    changeTodolistTitle: (id: string, newTitle: string) => void
    demo?: boolean
}

export const Todolist = React.memo(function (props: PropsType) {
    const {demo = false, todolist, changeFilter, tasks} = props
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(tasksThunks.fetchTasks(todolist.id))
    }, [])

    const addTask = useCallback((title: string) => {
        dispatch(tasksThunks.addTask({taskTitle: title, todolistId: todolist.id}))
    }, [todolist.id])

    const removeTodolist = () => {
        dispatch(thunkTodo.removeTodo({id: todolist.id}))
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(todolist.id, title)
    }, [todolist.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => changeFilter('all', todolist.id), [todolist.id, changeFilter])
    const onActiveClickHandler = useCallback(() => changeFilter('active', todolist.id), [todolist.id, changeFilter])
    const onCompletedClickHandler = useCallback(() => changeFilter('completed', todolist.id), [todolist.id, changeFilter])

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todolist.id}/>)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})



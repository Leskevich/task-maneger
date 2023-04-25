import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {AppRootStateType} from 'app/store'
import {changeTodolistFilter, FilterValuesType, thunkTodo, TodolistDomainType} from './todolists-reducer'
import {TasksStateType} from './tasks-reducer'
import {Grid, Paper} from '@mui/material'
import {Todolist} from './todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {useActions} from "common/hooks";
import {AddItemForm} from "common/components";


type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const {fetchTodolists, addTodo, changeTitleTodo} = useActions(thunkTodo)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodolists()
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        changeTodolistFilter({id, filter})
    }, [])

    const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
        changeTitleTodo({todolistId, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodo({title})
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                changeFilter={changeFilter}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}

import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from 'api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from 'app/store'
import {setAppStatus} from 'app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from 'utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolist, removeTodolist, setTodolists} from "features/TodolistsList/todolists-reducer";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
const initialState: TasksStateType = {}


const slice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) => {
            state[action.payload.todolistId] = action.payload.tasks
        },
        addTask: (state, action: PayloadAction<TaskType>) => {
            state[action.payload.todoListId].unshift(action.payload)
        },
        removeTask: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.taskId)
            task.splice(index, 1)

        },
        updateTask: (state, action: PayloadAction<{
            taskId: string,
            model: UpdateDomainTaskModelType,
            todolistId: string
        }>) => {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                task[index] = {...task[index], ...action.payload.model}
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(setTodolists, (state, action) => {
            action.payload.forEach(t => state[t.id] = [])
        })
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(removeTodolist, (state, action) => {
            delete state[action.payload.id]
        })
    },

})
export const tasksReducer = slice.reducer
export const {setTasks, addTask, removeTask, updateTask} = slice.actions

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: "loading"}))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            dispatch(setTasks({tasks, todolistId}))
            dispatch(setAppStatus({status: "succeeded"}))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            const action = removeTask({taskId, todolistId})
            dispatch(action)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: "loading"}))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTask({...task})
                dispatch(action)
                dispatch(setAppStatus({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTask({taskId, model: res.data.data, todolistId})
                    dispatch(action)
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}




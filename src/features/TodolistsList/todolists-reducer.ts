import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {RequestStatusType, setAppStatus} from 'app/app-reducer'
import {handleServerNetworkError} from 'utils/error-utils'
import {AppThunk} from 'app/store'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []


const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {
        setTodolists: (state, action: PayloadAction<TodolistType[]>) => {
            action.payload.forEach(tl => state.push({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todo = state.find(t => t.id === action.payload.id)
            if (todo) todo.title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todo = state.find(t => t.id === action.payload.id)
            if (todo) todo.filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const todo = state.find(t => t.id === action.payload.id)
            if (todo) todo.entityStatus = action.payload.status
        }
    }
})

export const todolistsReducer = slice.reducer
export const {
    changeTodolistEntityStatus,
    changeTodolistFilter,
    changeTodolistTitle,
    removeTodolist,
    addTodolist,
    setTodolists
} = slice.actions


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatus({status: "loading"}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolists(res.data))
                dispatch(setAppStatus({status: "succeeded"}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (id: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(setAppStatus({status: "loading"}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(changeTodolistEntityStatus({id, status: "loading"}))
        todolistsAPI.deleteTodolist(id)
            .then(() => {
                dispatch(removeTodolist({id}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(setAppStatus({status: "succeeded"}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatus({status: "loading"}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolist({todolist: res.data.data.item}))
                dispatch(setAppStatus({status: "succeeded"}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title)
            .then(() => {
                dispatch(changeTodolistTitle({id, title}))
            })
    }
}






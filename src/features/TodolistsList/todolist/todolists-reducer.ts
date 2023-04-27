import {appActions, RequestStatusType} from 'app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerError} from "common/utils";
import {todolistsAPI, TTodolist, TUpdateTodo} from 'features/TodolistsList/todolist/todolistsAPI';
import {TResultCode} from "common/commonType";
import {ThunkTryCatch} from "common/utils/thunk-try-catch";


const fetchTodolists = createAppAsyncThunk<TTodolist[]>
('todolist/fetchTodolists', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await todolistsAPI.getTodolists()
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return res.data
    } catch (e) {
        handleServerError(e, dispatch)
        return rejectWithValue(null)
    }
})

const removeTodo = createAppAsyncThunk<{ id: string }, { id: string }>
('todolist/removeTodo', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        dispatch(actionsTodo.changeTodolistEntityStatus({id: arg.id, status: "loading"}))
        await todolistsAPI.deleteTodolist(arg.id)
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {id: arg.id}
    } catch (e) {
        handleServerError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTodo = createAppAsyncThunk<{ todolist: TTodolist }, { title: string }>
('todolist/addTodo', (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    return ThunkTryCatch(thunkAPI, async () => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await todolistsAPI.createTodolist(arg.title)
        if (res.resultCode === TResultCode.OK) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolist: res.data.item}
        } else {
            dispatch(appActions.setAppStatus({status: "failed"}))
            return rejectWithValue(res)
        }
    })
})

const changeTitleTodo = createAppAsyncThunk<TUpdateTodo, TUpdateTodo>
('todolist/changeTitleTodo', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        await todolistsAPI.updateTodolist({title: arg.title, todolistId: arg.todolistId})
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return arg
    } catch (e) {
        handleServerError(e, dispatch)
        return rejectWithValue(null)
    }
})

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TTodolist & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todo = state.find(t => t.id === action.payload.id)
            if (todo) todo.filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
            const todo = state.find(t => t.id === action.payload.id)
            if (todo) todo.entityStatus = action.payload.status
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolists.fulfilled, (state, action) => {
            action.payload.forEach(tl => state.push({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        builder.addCase(addTodo.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
        builder.addCase(removeTodo.fulfilled, (state, action) => {
            const index = state.findIndex(t => t.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        })
        builder.addCase(changeTitleTodo.fulfilled, (state, action) => {
            const todo = state.find(t => t.id === action.payload.todolistId)
            if (todo) todo.title = action.payload.title
        })
    }
})

export const todolistsReducer = slice.reducer
export const thunkTodo = {fetchTodolists, removeTodo, addTodo, changeTitleTodo}
export const actionsTodo = slice.actions








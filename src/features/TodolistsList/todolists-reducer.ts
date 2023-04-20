import {todolistsAPI, TodolistType, TUpdateTodo} from 'api/todolists-api'
import {appActions, RequestStatusType} from 'app/app-reducer'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleNetworkError} from "common/utils";


const fetchTodolists = createAppAsyncThunk<TodolistType[]>('todolist/fetchTodolists', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await todolistsAPI.getTodolists()
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return res.data
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const removeTodo = createAppAsyncThunk<{ id: string }, { id: string }>('todolist/removeTodo', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        dispatch(changeTodolistEntityStatus({id: arg.id, status: "loading"}))
        await todolistsAPI.deleteTodolist(arg.id)
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {id: arg.id}
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTodo = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>
('todolist/addTodo', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await todolistsAPI.createTodolist(arg.title)
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {todolist: res.data.data.item}
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const changeTitleTodo = createAppAsyncThunk<TUpdateTodo, TUpdateTodo>('todolist/changeTitleTodo', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        await todolistsAPI.updateTodolist({title: arg.title, todolistId: arg.todolistId})
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return arg
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

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
export const {changeTodolistEntityStatus, changeTodolistFilter} = slice.actions








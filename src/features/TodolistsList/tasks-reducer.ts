import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    TcreateTaskArgs,
    TdeleteTasks,
    todolistsAPI,
    TupdateTaskArgs,
    UpdateTaskModelType
} from 'api/todolists-api'
import { handleNetworkError} from 'common/utils/handle-network-error'
import {createSlice} from "@reduxjs/toolkit";
import {thunkTodo} from "features/TodolistsList/todolists-reducer";
import {appActions} from "app/app-reducer";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleAppError} from "common/utils/handle-app-error";

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
const initialState: TasksStateType = {}


const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>
('task/fetchTasks', async (todolistId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {tasks, todolistId}
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const addTask = createAppAsyncThunk<TaskType, TcreateTaskArgs>(
    "task/addTask", async (args, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {

            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.createTask(args)
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(appActions.setAppStatus({status: "succeeded"}))
                return {...task}
            } else {
                handleAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e) {
            handleNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)


const updateTask = createAppAsyncThunk<TupdateTaskArgs, { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string
}>('task/updateTask', async (args, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const state = getState()
        const task = state.tasks[args.todolistId].find(t => t.id === args.taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...args.domainModel
        }

        const res = await todolistsAPI.updateTask({todolistId: args.todolistId, taskId: args.taskId, model: apiModel})

        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {taskId: args.taskId, model: res.data.data.item, todolistId: args.todolistId}
        } else {
            handleAppError(res.data, dispatch);
            dispatch(appActions.setAppStatus({status: "failed"}))
            return rejectWithValue(null)
        }

    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const removeTask = createAppAsyncThunk<TdeleteTasks, TdeleteTasks>('task/removeTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        await todolistsAPI.deleteTask(arg)
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        return arg
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const slice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(thunkTodo.fetchTodolists.fulfilled, (state, action) => {
            action.payload.forEach(t => state[t.id] = [])
        })
        builder.addCase(thunkTodo.addTodo.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        })
        builder.addCase(thunkTodo.removeTodo.fulfilled, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        })
        builder.addCase(addTask.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift(action.payload)
            console.log(state[action.payload.todoListId])
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                task[index] = {...task[index], ...action.payload.model}
            }
        })
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const task = state[action.payload.todolistId]
            const index = task.findIndex(t => t.id === action.payload.taskId)
            task.splice(index, 1)
        })
    },
})
export const tasksReducer = slice.reducer

export const tasksThunks = {fetchTasks, addTask, updateTask, removeTask}


export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}




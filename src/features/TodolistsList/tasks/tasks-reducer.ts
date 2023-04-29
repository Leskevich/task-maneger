import { createSlice } from "@reduxjs/toolkit";
import { thunkTodo } from "features/TodolistsList/todolist/todolists-reducer";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";

import {
  taskAPI,
  TCreateTaskArgs,
  TDeleteTasks,
  TTask,
  TUpdateTaskArgs,
  TUpdateTaskModel,
} from "features/TodolistsList/tasks/taskAPI";
import { TResultCode } from "../../../common/commonType";

export type TasksStateType = {
  [key: string]: Array<TTask>;
};
const initialState: TasksStateType = {};

const fetchTasks = createAppAsyncThunk<{ tasks: TTask[]; todolistId: string }, string>(
  "task/fetchTasks",
  async (todolistId: string, {}) => {
    const res = await taskAPI.getTasks(todolistId);
    const tasks = res.data.items;
    return { tasks, todolistId };
  }
);

const addTask = createAppAsyncThunk<TTask, TCreateTaskArgs>("task/addTask", async (args, { rejectWithValue }) => {
  const res = await taskAPI.createTask(args);
  if (res.data.resultCode === 0) {
    const task = res.data.data.item;
    return { ...task };
  } else {
    return rejectWithValue({ data: res.data });
  }
});

const updateTask = createAppAsyncThunk<
  TUpdateTaskArgs,
  {
    taskId: string;
    domainModel: TUpdateDomainTaskModel;
    todolistId: string;
  }
>("task/updateTask", async (args, { rejectWithValue, getState }) => {
  const state = getState();
  const task = state.tasks[args.todolistId].find((t) => t.id === args.taskId);
  if (!task) {
    return rejectWithValue(null);
  }

  const apiModel: TUpdateTaskModel = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...args.domainModel,
  };
  const res = await taskAPI.updateTask({ todolistId: args.todolistId, taskId: args.taskId, model: apiModel });
  if (res.data.resultCode === 0) {
    return { taskId: args.taskId, model: res.data.data.item, todolistId: args.todolistId };
  } else {
    return rejectWithValue(null);
  }
});

const removeTask = createAppAsyncThunk<TDeleteTasks, TDeleteTasks>(
  "task/removeTask",
  async (arg, { rejectWithValue }) => {
    const res = await taskAPI.deleteTask(arg);
    if (res.data.resultCode === TResultCode.OK) {
      return arg;
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(thunkTodo.fetchTodolists.fulfilled, (state, action) => {
      action.payload.forEach((t) => (state[t.id] = []));
    });
    builder.addCase(thunkTodo.addTodo.fulfilled, (state, action) => {
      if (action.payload.todolist.id) state[action.payload.todolist.id] = [];
    });
    builder.addCase(thunkTodo.removeTodo.fulfilled, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.todoListId].unshift(action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId];
      const index = task.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) task[index] = { ...task[index], ...action.payload.model };
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const task = state[action.payload.todolistId];
      const index = task.findIndex((t) => t.id === action.payload.taskId);
      task.splice(index, 1);
    });
  },
});
export const tasksReducer = slice.reducer;

export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };

export type TUpdateDomainTaskModel = Partial<TUpdateTaskModel>;

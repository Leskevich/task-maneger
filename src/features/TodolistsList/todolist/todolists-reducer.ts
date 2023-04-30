import { RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { todolistsAPI, TTodolist, TUpdateTodo } from "features/TodolistsList/todolist/todolistsAPI";
import { TResultCode } from "common/commonType";

const fetchTodolists = createAppAsyncThunk<TTodolist[]>("todolist/fetchTodolists", async (_, {}) => {
  const res = await todolistsAPI.getTodolists();
  return res.data;
});

const removeTodo = createAppAsyncThunk<{ id: string }, { id: string }>(
  "todolist/removeTodo",
  async (arg, { rejectWithValue }) => {
    const res = await todolistsAPI.deleteTodolist(arg.id);
    if (res.data.resultCode === TResultCode.OK) {
      return { id: arg.id };
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);

const addTodo = createAppAsyncThunk<{ todolist: TTodolist }, { title: string }>(
  "todolist/addTodo",
  async (arg, { rejectWithValue }) => {
    const res = await todolistsAPI.createTodolist(arg.title);
    if (res.data.resultCode === TResultCode.OK) {
      return { todolist: res.data.data.item };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const changeTitleTodo = createAppAsyncThunk<TUpdateTodo, TUpdateTodo>(
  "todolist/changeTitleTodo",
  async (arg, { rejectWithValue }) => {
    const res = await todolistsAPI.updateTodolist({ title: arg.title, todolistId: arg.todolistId });
    if (res.data.resultCode === TResultCode.OK) {
      return arg;
    } else {
      return rejectWithValue({ data: res.data });
    }
  }
);

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TTodolist & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolist",
  initialState,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) todo.filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) todo.entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolists.fulfilled, (state, action) => {
      action.payload.forEach((tl) => state.push({ ...tl, filter: "all", entityStatus: "idle" }));
    });
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    });
    builder.addCase(removeTodo.fulfilled, (state, action) => {
      const index = state.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.splice(index, 1);
    });
    builder.addCase(changeTitleTodo.fulfilled, (state, action) => {
      const todo = state.find((t) => t.id === action.payload.todolistId);
      if (todo) todo.title = action.payload.title;
    });
  },
});

export const todolistsReducer = slice.reducer;
export const thunkTodo = { fetchTodolists, removeTodo, addTodo, changeTitleTodo };
export const actionsTodo = slice.actions;

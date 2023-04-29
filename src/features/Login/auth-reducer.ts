import { createSlice } from "@reduxjs/toolkit";
import { appThunk } from "app/app-reducer";
import { createAppAsyncThunk } from "common/utils";
import { authAPI, LoginParamsType } from "./authApi";
import { TResultCode } from "common/commonType";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  "auth/login",
  async (arg, { rejectWithValue }) => {
    const res = await authAPI.login(arg);
    if (res.data.resultCode === TResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      const isShowError = !res.data.fieldsErrors.length;
      return rejectWithValue({ data: res.data, showGlobalError: isShowError });
    }
  }
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/logout", async (arg, { rejectWithValue }) => {
  const res = await authAPI.logout();
  if (res.data.resultCode === TResultCode.OK) {
    return { isLoggedIn: false };
  } else {
    return rejectWithValue(null);
  }
});

const initialState = {
  isLoggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
    builder.addCase(appThunk.me.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    });
  },
});

export const authReducer = authSlice.reducer;
export const authThunk = { login, logout };

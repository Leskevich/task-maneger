import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "features/Login";
import { createAppAsyncThunk } from "common/utils";
import { TResultCode } from "common/commonType";
import { AnyAction } from "redux";
import { RequestStatus } from "common/utils/consts";

const me = createAppAsyncThunk<{ isLoggedIn: boolean }>("app/initializeApp", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === TResultCode.OK) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  }
});
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialStateType = typeof initialState;
const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
    setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: AnyAction) => {
        return action.type.endsWith("pending");
      },
      (state) => {
        state.status = RequestStatus.LOADING;
      }
    );
    builder.addMatcher(
      (action: AnyAction) => {
        return action.type.endsWith("fulfilled");
      },
      (state) => {
        state.status = RequestStatus.SUCCEEDED;
      }
    );
    builder.addMatcher(
      (action) => {
        return action.type.endsWith("rejected");
      },
      (state, action: AnyAction) => {
        const { payload } = action;
        if (payload) {
          if (payload.showGlobalError) {
            console.log(action);
          }
        }

        state.status = RequestStatus.FAILED;
      }
    );
  },
});
export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const appThunk = { me };

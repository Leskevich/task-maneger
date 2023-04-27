import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "features/Login";
import {createAppAsyncThunk, handleAppError, handleServerError} from "common/utils";
import {TResultCode} from 'common/commonType';

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

const me = createAppAsyncThunk<{ isLoggedIn: boolean }>('app/initializeApp', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "succeeded"}))
        const res = await authAPI.me()
        if (res.data.resultCode === TResultCode.OK) {
            return {isLoggedIn: true}
        } else {
            handleAppError(res.data, dispatch);
            dispatch(appActions.setAppStatus({status: "failed"}))
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppInitialized({isInitialized: true}));
    }
})

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        }
    }
})
export const appReducer = appSlice.reducer
export const appActions = appSlice.actions
export const appThunk = {me}






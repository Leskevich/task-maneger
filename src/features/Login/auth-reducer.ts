import {createSlice} from "@reduxjs/toolkit";
import {appActions, appThunk} from "app/app-reducer";
import {createAppAsyncThunk, handleAppError, handleNetworkError} from "common/utils";
import {authAPI, LoginParamsType} from './authApi';
import {TResultCode} from "common/commonType";

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await authAPI.login(arg)
        if (res.data.resultCode === TResultCode.OK) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {isLoggedIn: true}
        } else {
            handleAppError(res.data, dispatch);
            return rejectWithValue(res.data)
        }
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }>('auth/logout', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}))
        const res = await authAPI.logout()
        if (res.data.resultCode === TResultCode.OK) {
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {isLoggedIn: false}
        } else {
            handleAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})


const initialState = {
    isLoggedIn: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(appThunk.me.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = authSlice.reducer
export const authThunk = {login, logout}


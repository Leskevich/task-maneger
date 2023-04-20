import {Dispatch} from 'redux'
import {authAPI, LoginParamsType} from 'api/todolists-api'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";
import {handleAppError, handleNetworkError} from "common/utils";

const initialState = {
    isLoggedIn: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})

export const authReducer = authSlice.reducer
export const {setIsLoggedIn} = authSlice.actions

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<any>) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn: true}))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch: Dispatch<any>) => {
    dispatch(appActions.setAppStatus({status: "loading"}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({isLoggedIn: false}))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            } else {
                handleAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleNetworkError(error, dispatch)
        })
}
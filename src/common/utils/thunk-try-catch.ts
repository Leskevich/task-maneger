import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, AppRootStateType} from "app/store";
import {handleServerError} from "common/utils/handle-server-error";

export const ThunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        return logic()
    } catch (e) {
        handleServerError(e, dispatch)
        return rejectWithValue(null)
    }
};


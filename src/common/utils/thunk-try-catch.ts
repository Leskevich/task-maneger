import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import {AppDispatch, AppRootStateType} from "app/store";
import {handleNetworkError} from "common/utils/handle-network-error";

export const ThunkTryCatch = async (thunkAPI: BaseThunkAPI<AppRootStateType, any, AppDispatch, null>, logic: Function) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        return logic()
    } catch (e) {
        handleNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
};


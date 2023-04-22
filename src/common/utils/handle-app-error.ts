import {ResponseType} from "common/commonType";
import {Dispatch} from "redux";
import {appActions} from "app/app-reducer";

export const handleAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {

    appActions.setAppError(data.messages.length ? {error: data.messages[0]} : {error: 'Some error occurred'})

    dispatch(appActions.setAppStatus({status: "failed"}))
}
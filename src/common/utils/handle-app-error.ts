import {ResponseType} from "common/commonType";
import {Dispatch} from "redux";
import {appActions} from "app/app-reducer";

/**
 * обрабатка ошибок App
 * @param data ResponseType<D>
 * @param dispatch
 * @param showError
 */
export const handleAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if (showError) {
        appActions.setAppError(data.messages.length ? {error: data.messages[0]} : {error: 'Some error occurred'})
    }
    dispatch(appActions.setAppStatus({status: "failed"}))
}
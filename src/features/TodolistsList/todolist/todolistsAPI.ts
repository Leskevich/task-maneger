import {AxiosResponse} from "axios";
import {instance,} from "common/instace";
import {ResponseType} from "common/commonType";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TTodolist[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<any, AxiosResponse<ResponseType<{ item: TTodolist }>, { title: string }>, {
            title: string
        }>('todo-lists', {title: title}).then(res=>res.data);
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(args: TUpdateTodo) {
        return instance.put<ResponseType>(`todo-lists/${args.todolistId}`, {title: args.title});
    },
}

export type TUpdateTodo = { todolistId: string, title: string }
export type TTodolist = {
    id: string
    title: string
    addedDate: string
    order: number
}

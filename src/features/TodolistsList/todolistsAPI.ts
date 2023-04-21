import {AxiosResponse} from "axios";
import {instance,} from "common/instace";
import {ResponseType, TaskPriorities, TaskStatuses} from "common/commonType";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TTodolist[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<any, AxiosResponse<ResponseType<{ item: TTodolist }>>, {
            title: string
        }>('todo-lists', {title: title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(args: TUpdateTodo) {
        return instance.put<ResponseType>(`todo-lists/${args.todolistId}`, {title: args.title});
    },
    getTasks(todolistId: string) {
        return instance.get<TGetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(args: TDeleteTasks) {
        return instance.delete<ResponseType>(`todo-lists/${args.todolistId}/tasks/${args.taskId}`);
    },
    createTask(args: TCreateTaskArgs) {
        return instance.post<ResponseType<{ item: TTask }>>
        (`todo-lists/${args.todolistId}/tasks`, {title: args.taskTitle});
    },
    updateTask(args: TUpdateTaskArgs) {
        return instance.put<ResponseType<{
            item: TTask
        }>>(`todo-lists/${args.todolistId}/tasks/${args.taskId}`, args.model);
    }
}

export type TUpdateTodo = { todolistId: string, title: string }
export type TDeleteTasks = { todolistId: string, taskId: string }
export type TUpdateTaskArgs = { todolistId: string, taskId: string, model: TUpdateTaskModel }
export type TCreateTaskArgs = { todolistId: string, taskTitle: string }
export type TTodolist = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type TTask = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type TUpdateTaskModel = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type TGetTasksResponse = {
    error: string | null
    totalCount: number
    items: TTask[]
}
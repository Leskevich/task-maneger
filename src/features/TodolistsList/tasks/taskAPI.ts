import {instance} from "common/instace";
import {ResponseType, TaskPriorities, TaskStatuses} from "common/commonType";

export const taskAPI = {
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

type TGetTasksResponse = {
    error: string | null
    totalCount: number
    items: TTask[]
}
export type TDeleteTasks = { todolistId: string, taskId: string }
export type TUpdateTaskArgs = { todolistId: string, taskId: string, model: TUpdateTaskModel }
export type TCreateTaskArgs = { todolistId: string, taskTitle: string }
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

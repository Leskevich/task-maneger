import axios, {AxiosResponse} from 'axios'

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41'
    }
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

// api
export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return instance.post<any, AxiosResponse<ResponseType<{ item: TodolistType }>>, {
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
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(args: TdeleteTasks) {
        return instance.delete<ResponseType>(`todo-lists/${args.todolistId}/tasks/${args.taskId}`);
    },
    createTask(args: TcreateTaskArgs) {
        return instance.post<ResponseType<{ item: TaskType }>>
        (`todo-lists/${args.todolistId}/tasks`, {title: args.taskTitle});
    },
    updateTask(args: TupdateTaskArgs) {
        return instance.put<ResponseType<{
            item: TaskType
        }>>(`todo-lists/${args.todolistId}/tasks/${args.taskId}`, args.model);
    }
}

export type TUpdateTodo = { todolistId: string, title: string }
export type TdeleteTasks = { todolistId: string, taskId: string }
export type TupdateTaskArgs = { todolistId: string, taskId: string, model: UpdateTaskModelType }
export type TcreateTaskArgs = { todolistId: string, taskTitle: string }
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId?: number }>>('auth/login', data);

    },
    logout() {
        return instance.delete<ResponseType<{ userId?: number }>>('auth/login');

    },
    me() {
        return instance.get<ResponseType<{ id: number; email: string; login: string }>>('auth/me');

    }
}

// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
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
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

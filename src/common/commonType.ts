type TFieldsError = {
    error: string,
    field: string
}

export type ResponseType<D = {}> = {
    fieldsErrors: TFieldsError[]
    resultCode: number
    messages: Array<string>
    data: D
}


export const TResultCode = {
    OK: 0,
    FAIL: 1,
    CAPTCHA: 10,
} as const

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
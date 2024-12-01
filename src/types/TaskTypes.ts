export interface ITask {
    title: string,
    description: string,
    dueDate: string,
    status: string,
    createdUser?: string
}

export interface ITaskResponse {
    _id?: string,
    title: string,
    description: string,
    status: string,
    dueDate: Date,
    createdUser: {
        _id?: string,
        firstName: string,
        lastName: string,
        email: string
    },
}
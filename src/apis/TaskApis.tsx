import { toast } from "sonner";
import { BASEURL } from "../App"
import { IUser } from "../types/userTypes"
import { ITask } from "../types/TaskTypes";


export const loginApi = async (user: IUser) => {
    try {
        const responses = await fetch(`${BASEURL}/api/auth/signin`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include'
        })
        const result = await responses.json();
        toast.success(result.message)
        return result.responses
    } catch (error) {
        toast.error("Error in login api")

    }
}

export const getAllTaskApi = async () => {
    try {
        const response = await fetch(`${BASEURL}/api/task/getAll-task`, {
            method: "GET",
            credentials: 'include'
        })
        const result = await response.json()
        if (!response.ok) {
            toast.error("Token not found")
        }
        return result.responses
    } catch (error) {
        toast.error("Internal server error")
    }
}

export const createTaskApi = async (task: ITask) => {
    try {
        const response = await fetch(`${BASEURL}/api/task/create-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(task)
        })
        const result = await response.json();
        if (!response.ok) {
            toast.message("Internal server error")
        }
        console.log(result)
        toast.success(result.message)
        return result.responses
    } catch (error) {
        toast.success("Internal server error")

    }
}

export const deleteTaskApi = async (id: string) => {
    try {
        const response = await fetch(`${BASEURL}/api/task/delete-task/${id}`, {
            method: "DELETE",
            credentials: 'include'
        });

        if (!response.ok) {
            toast.error("Internal server error")
        }

        const result = await response.json();
        toast.success(result.message)
        return result.responses
    } catch (error) {
        toast.error("Internal server error")

    }
}

export const updateTaskApi = async (id: string, task: ITask) => {
    console.log(id, task)
    try {
        const response = await fetch(`${BASEURL}/api/task/update-task/${id}`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        if (!response.ok) {
            console.log('Responses not ok')
        }
        const result = await response.json();
        toast.success(result.message)
        return result
    } catch (error) {
        console.log(error)
    }
}

export const singleTaskApi = async (id: string) => {
    try {
        const response = await fetch(`${BASEURL}/api/task/single-task/${id}`, {
            method: "GET",
            credentials: "include",
        })
        if (!response.ok) {
            console.log("Data not found")
        }
        const result = await response.json();
        return result.responses;
    } catch (error) {
        console.log(error)
    }
}
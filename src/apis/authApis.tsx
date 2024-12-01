import { toast } from "sonner";
import { BASEURL } from "../App";

export const decodeApi = async () => {
    try {
        const response = await fetch(`${BASEURL}/api/auth/decode`, {
            method: "GET",
            credentials: 'include'
        })
        if (!response.ok) {
            toast.error("Error in fetch api")
        }
        const result = await response.json();
        return result.responses;
    } catch (error) {
        console.log(error)
    }
}

export const logoutApi = async () => {
    try {
        const respose = await fetch(`${BASEURL}/api/auth/logout`, {
            method: "GET",
            credentials: 'include'
        })
        const result = await respose.json();
        toast.success(result.message)
    } catch (error) {
        console.log(error)
    }
}
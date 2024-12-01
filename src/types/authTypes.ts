export interface IAuthUser {
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
}

export interface IAuthContextProps {
    decodeToken: IAuthUser | null,
    logout: () => void,
    isAuthndicated: boolean
}
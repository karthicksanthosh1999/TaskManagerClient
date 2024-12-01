import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { IAuthContextProps, IAuthUser } from "../types/authTypes";
import { decodeApi, logoutApi } from "../apis/authApis";


export const AuthContext = createContext<IAuthContextProps>({
    decodeToken: null,
    logout: () => { },
    isAuthndicated: false
})


export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [decodeToken, setDecodeToken] = useState<IAuthUser | null>(null)
    const [isAuthndicated, setIsisAuthndicated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await decodeApi();
                if (res) {
                    setDecodeToken(res);
                    setIsisAuthndicated(true);
                } else {
                    setDecodeToken(null);
                    setIsisAuthndicated(false);
                }
            } catch (err) {
                setDecodeToken(null);
                setIsisAuthndicated(false);
            }
        };

        checkAuth();
    }, []);

    const logout = () => {
        logoutApi().then((_res) => {
            setDecodeToken(null);
            setIsisAuthndicated(false);
        }).catch(err => console.log(err))
    }

    return (
        <AuthContext.Provider value={{ decodeToken, logout, isAuthndicated }} >
            {children}
        </AuthContext.Provider>
    )
}
import { useState, useEffect, createContext, ReactNode, FC } from 'react';
import { IThemeType } from '../types/ThemeType';

export const themeContext = createContext<IThemeType | undefined>(undefined);

export const ThemeProvider:FC<{children:ReactNode}> = ({children}) => {
    const saveTheme = localStorage.getItem('theme');
    const initalTheme = saveTheme || "theme";

    const [theme, setTheme] = useState<string>(initalTheme);

    const toggleTheme = () => {
        const newtheme = theme === "light" ? "dark" : "light";
        setTheme(newtheme);
        localStorage.setItem("theme", newtheme)
    }

    useEffect(()=>{
        document.body.classList.remove("light","dark")
        document.body.classList.add(theme)
    },[theme])

    return(
        <themeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </themeContext.Provider>
    )

}
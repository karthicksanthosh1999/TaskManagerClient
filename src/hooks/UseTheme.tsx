import { useContext } from 'react'
import { themeContext } from '../context/ThemeContext'
import { IThemeType } from '../types/ThemeType';

export const UseTheme = (): IThemeType => {
    const context = useContext(themeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context;
}
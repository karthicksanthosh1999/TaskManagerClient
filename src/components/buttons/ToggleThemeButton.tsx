import { FC } from 'react'
import { UseTheme } from '../../hooks/UseTheme'
import { Moon, Sun } from 'lucide-react'

const ToggleThemeButton: FC = () => {
    const { theme, toggleTheme } = UseTheme()
    return (
        <section>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-md shadow-md"
            >
                {theme === 'light' ? <Moon /> : <Sun className='text-white' />}
            </button>
        </section>
    )
}

export default ToggleThemeButton
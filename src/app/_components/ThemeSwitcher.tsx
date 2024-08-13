import { useEffect, useState } from "react";
import { useTheme } from "../context/AppThemeProvider";
import { Button } from "./button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, toggleDarkMode } = useTheme();
    const darkMode = theme.mode === 'dark';

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null
    var iconClass = '';
    if (darkMode) {
        iconClass = 'text-white size-8'
    } else {
        iconClass = 'size-8 text-black'
    }

    return (
        <div className="fixed top-5 left-2">
            <Button aria-label="Light Mode" className='h-18 w-18 bg-transparent hover:bg-transparent border-none rounded-full p-4 hover:shadow-md'
                onClick={toggleDarkMode}>
                {darkMode ? <SunIcon className={iconClass} /> : <MoonIcon className={iconClass} />}
            </Button>
        </div>
    )
};
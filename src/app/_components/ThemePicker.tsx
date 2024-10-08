import React, { useState } from 'react';
import { themes, useTheme } from '../context/AppThemeProvider';

const ThemePicker = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className='flex flex-col fixed top-4 right-4'>
            {themes.map((t, i) => (
                <button
                    key={i}
                    className={`w-8 h-8 bg-gradient mr-2 mb-2 theme-${t.name}-${t.mode} rounded-full border-2 ${theme.name === t.name && theme.mode === t.mode ? 'border-blue-500' : 'border-white'}`}
                    onClick={() => setTheme({ mode: theme.mode, name: t.name })}
                    title={`${t.name} ${t.mode}`}
                />
            ))}
        </div>
    );
};

export default ThemePicker;
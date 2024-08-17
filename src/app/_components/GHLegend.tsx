import React from 'react';
import { useTheme } from '../context/AppThemeProvider';

const GHLegend = ({ username }: { username?: string }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    const legendColors = [
        'bg-gray-100',
        'bg-green-200',
        'bg-green-400',
        'bg-green-600',
    ];

    return (
        <div className={`px-4 flex justify-between items-center p-2  ${isDark ? 'bg-gray-800' : 'bg-white'} `}>
            {
                username && (
                    <div className={`pt-2 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} font-bold`}>
                        <span className={`${isDark ? 'text-green-600' : 'text-green-800'}`}>
                            {`@${username} `}
                        </span>
                        <span>
                            on GitHub
                        </span>
                    </div>)
            }
            <div className="flex items-center space-x-1">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Less</span>
                {legendColors.map((color, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 ${color} ${isDark ? 'border-gray-700' : 'border-gray-300'} border`}
                    />
                ))}
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>More</span>
            </div>
        </div >
    );
};

export default GHLegend;
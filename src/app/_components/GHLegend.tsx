import React from 'react';
import { useTheme } from '../context/AppThemeProvider';
import { useAppSelector } from '../hooks/Legend';

const GHLegend = ({ username }: { username?: string }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const legendColors = useAppSelector((state) => state.legend.legendColors);
    return (
        <div className={`px-4 flex justify-between items-center p-2  ${isDark ? 'bg-gray-800' : 'bg-white'} `}>
            {
                username && (
                    <div className={` font-mono pt-2 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} font-bold`}>
                        <span className={`${legendColors[4]}`}>
                            {`@${username} `}
                        </span>
                        <span>
                            on GitHub
                        </span>
                    </div>)
            }
            <div className="flex items-center space-x-1">
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Less</span>
                {legendColors.slice(0, 4).map((color, index) => (
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
// src/components/StreakCard.tsx

import React from 'react';
import { useTheme } from '../context/AppThemeProvider';

interface StreakCardProps {
    currentStreak: number | undefined;
    maxStreak: number | undefined;
    totalContributions: number | undefined;
    activeDays: number | undefined;
    isCurrentYear: boolean | true;
}

const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, maxStreak, totalContributions, isCurrentYear, activeDays }) => {
    const { theme, setTheme } = useTheme();
    const isDark = theme.mode === 'dark';
    function streakStats(label: string, value: number | undefined) {
        return (
            <div className="flex flex-row justify-between items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
                <p className="text-sm sm:text-base font-semibold ">{label}</p>
                <p className={`text-sm sm:text-base font-bold`}>{value ?? 0} days</p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col md:flex-grow ${isDark ? 'bg-gray-800' : 'bg-white'} p-2 sm:p-6 rounded-lg shadow-md`}>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Contribution Stats</h2>
            <div className={`${isDark ? 'text-gray-600' : 'text-gray-400'}grow flex flex-col justify-end space-y-4`}>
                <div className="flex flex-col items-center">
                    <p className={`text-sm font-medium `}>Total Contributions</p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-bold'>{totalContributions ?? 0}</p>
                </div>
                <div className='flex flex-col justify-end'>
                    {isCurrentYear && streakStats('Current Streak:', currentStreak)}
                    {streakStats('Max Streak:', maxStreak)}
                    {streakStats('Total Active Days:', activeDays)}
                </div>
            </div>
        </div>
    );
};

export default StreakCard;
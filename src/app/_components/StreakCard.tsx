// src/components/StreakCard.tsx

import React from 'react';

interface StreakCardProps {
    currentStreak: number | undefined;
    maxStreak: number | undefined;
    totalContributions: number | undefined;
    isCurrentYear: boolean | true;
}

const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, maxStreak, totalContributions, isCurrentYear }) => {

    function streakStats(label: string, value: number | undefined) {
        return (
            <div className="flex flex-row justify-between items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
                <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-slate-50">{label}</p>
                <p className="text-sm sm:text-base font-bold text-primary dark:text-white">{value ?? 0} days</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-grow bg-white dark:bg-gray-800 p-2 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-slate-50 mb-4">Contribution Stats</h2>
            <div className='grow flex flex-col justify-end space-y-4'>
                <div className="flex flex-col items-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contributions</p>
                    <p className='text-2xl sm:text-3xl md:text-4xl font-bold text-primary dark:text-white'>{totalContributions ?? 0}</p>
                </div>
                <div className='flex flex-col justify-end'>
                    {isCurrentYear && streakStats('Current Streak:', currentStreak)}
                    {streakStats('Max Streak:', maxStreak)}
                </div>
            </div>
        </div>
    );
};

export default StreakCard;
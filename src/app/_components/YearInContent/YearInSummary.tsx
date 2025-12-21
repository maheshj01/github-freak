import { motion } from 'framer-motion';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { YearStats } from '../../store/yearInGithubStore';
import { StatCardWrapper } from './YearStatCards';

interface YearInSummaryProps {
    stats: YearStats;
    selectedYear: number;
}

const YearInSummary: React.FC<YearInSummaryProps> = ({ stats, selectedYear }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaGithub />} gradient="bg-gradient-to-br from-gray-700 to-gray-900">
            <motion.h2
                className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Your {selectedYear} in a nutshell
            </motion.h2>
            <motion.div
                className="grid grid-cols-2 gap-4 text-left max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Commits</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalCommits.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>PRs</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalPRs}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Days</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeDays}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.longestStreak} days</p>
                </div>
            </motion.div>
        </StatCardWrapper>
    );
};

export default YearInSummary;
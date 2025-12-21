import { motion } from 'framer-motion';
import React from 'react';
import { FaFire } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { StatCardWrapper } from './YearStatCards';

interface YearInStreakProps {
    stats: any;
}

const YearInStreak: React.FC<YearInStreakProps> = ({ stats }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaFire />} gradient="bg-gradient-to-br from-orange-500 to-red-600">
            <motion.p
                className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Your longest streak was
            </motion.p>
            <motion.h2
                className={`text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
                {stats.longestStreak}
            </motion.h2>
            <motion.p
                className={`text-2xl mt-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                consecutive days 🔥
            </motion.p>
        </StatCardWrapper>
    );
};

export default YearInStreak;
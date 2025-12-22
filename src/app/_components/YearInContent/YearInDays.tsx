import { motion } from 'framer-motion';
import React from 'react';
import { FaCalendarCheck } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { StatCardWrapper } from './YearStatCards';

interface YearInDaysProps {
    stats: any;
}

const YearInDays: React.FC<YearInDaysProps> = ({ stats }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaCalendarCheck />} gradient="bg-gradient-to-br from-blue-500 to-cyan-600">
            <motion.p
                className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                You were active for
            </motion.p>
            <motion.h2
                className={`text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
                {stats.activeDays}
            </motion.h2>
            <motion.p
                className={`text-2xl mt-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                days this year 📅
            </motion.p>
        </StatCardWrapper>
    );
};

export default YearInDays;
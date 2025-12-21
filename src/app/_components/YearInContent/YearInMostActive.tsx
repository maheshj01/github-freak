import { motion } from 'framer-motion';
import React from 'react';
import { useTheme } from '../../context/AppThemeProvider';
import { StatCardWrapper } from './YearStatCards';
import { FaTrophy } from 'react-icons/fa';

interface YearInMostActiveProps {
    stats: any;
}

const YearInMostActive: React.FC<YearInMostActiveProps> = ({ stats }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaTrophy />} gradient="bg-gradient-to-br from-yellow-500 to-amber-600">
            <motion.p
                className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Your most productive day was
            </motion.p>
            <motion.h2
                className={`text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
                {stats.mostActiveDay}
            </motion.h2>
            <motion.p
                className={`text-2xl mt-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                Keep the momentum! 🏆
            </motion.p>
        </StatCardWrapper>
    );
};

export default YearInMostActive;

import { motion } from 'framer-motion';
import React from 'react';
import { FaCode } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { StatCardWrapper } from './YearStatCards';

interface YearInPrsProps {
    stats: any;
}

const YearInPrs: React.FC<YearInPrsProps> = ({ stats }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaCode />} gradient="bg-gradient-to-br from-purple-500 to-violet-600">
            <motion.p
                className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                You opened
            </motion.p>
            <motion.h2
                className={`text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-400`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
                {stats.totalPRs.toLocaleString()}
            </motion.h2>
            <motion.p
                className={`text-2xl mt-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                pull requests 🎯
            </motion.p>
        </StatCardWrapper>
    );
};

export default YearInPrs;
import { motion } from 'framer-motion';
import React from 'react';
import { FaCodeBranch } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { StatCardWrapper } from './YearStatCards';

interface YearInCommitsProps {
    stats: any;
}

const YearInCommits: React.FC<YearInCommitsProps> = ({ stats }) => {
    // Individual stat cards
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaCodeBranch />} gradient="bg-gradient-to-br from-green-500 to-emerald-600">
            <motion.p
                className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                You made
            </motion.p>
            <motion.h2
                className={`text-7xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
                {stats.totalCommits.toLocaleString()}
            </motion.h2>
            <motion.p
                className={`text-2xl mt-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                commits this year 🚀
            </motion.p>
        </StatCardWrapper>
    );
};

export default YearInCommits;



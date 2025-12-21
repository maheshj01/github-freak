import { motion } from 'framer-motion';
import React from 'react';
import { FaLaptopCode } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { StatCardWrapper } from './YearStatCards';

interface YearInLanguageProps {
    stats: any;
}

const YearInLanguage: React.FC<YearInLanguageProps> = ({ stats }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaLaptopCode />} gradient="bg-gradient-to-br from-pink-500 to-rose-600">
            <motion.p
                className={`text-xl mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Your top language was
            </motion.p>
            <motion.h2
                className={`text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
                {stats.topLanguage}
            </motion.h2>
            <motion.p
                className={`text-2xl mt-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                Master of code! 💻
            </motion.p>
        </StatCardWrapper>
    );
};

export default YearInLanguage;
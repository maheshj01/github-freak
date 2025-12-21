import { motion } from 'framer-motion';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import AnimatedButton from '../_components/AnimatedButton';
import { useTheme } from '../context/AppThemeProvider';


interface YearInContentProps {
    selectedYear: number;
    username: string;
}

const YearInContent: React.FC<YearInContentProps> = ({ selectedYear, username }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            <YearInIntro selectedYear={selectedYear} username={username} />
            <YearInFooter />
        </div>
    );
};

const YearInFooter: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <motion.p
            className={`absolute bottom-8 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
        >
            Powered by GitHub API
        </motion.p>
    );
};

const YearInIntro: React.FC<YearInContentProps> = ({ selectedYear, username }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
        >
            {/* Header */}
            <motion.div
                className="flex items-center justify-center gap-4 mb-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <FaGithub className={`text-7xl ${isDark ? 'text-white' : 'text-gray-900'}`} />
            </motion.div>

            <motion.h1
                className={`text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r ${isDark
                    ? 'from-violet-400 via-pink-400 to-cyan-400'
                    : 'from-violet-600 via-pink-600 to-cyan-600'
                    }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                Year in GitHub
            </motion.h1>

            <motion.p
                className={`text-6xl md:text-8xl font-black mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
            >
                {selectedYear}
            </motion.p>

            <motion.p
                className={`text-lg md:text-xl mb-12 max-w-md mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                Discover your GitHub journey. See your contributions, streaks, and coding highlights.
            </motion.p>

            <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <AnimatedButton onClick={() => { }}>
                    <div className='flex items-center justify-center gap-2 min-w-32'>
                        <p>Start</p>
                    </div>
                </AnimatedButton>
            </motion.div>
        </motion.div>
    );
};

export default YearInContent;

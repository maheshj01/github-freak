import { motion } from 'framer-motion';
import React from 'react';
import { FaChevronRight, FaGithub } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { useYearInGithubStore } from '../../store/yearInGithubStore';
import AnimatedButton from '../AnimatedButton';

interface YearInIntroProps {
    selectedYear: number;
    onStart: () => void;
}

const YearInIntro: React.FC<YearInIntroProps> = ({ selectedYear, onStart }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const { username, setUsername } = useYearInGithubStore();
    const [inputUsername, setInputUsername] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputUsername.trim()) {
            setUsername(inputUsername);
            // Navigate to the year page with username
            window.location.href = `/year/${selectedYear}/${inputUsername.trim()}`;
        }
    };

    const handleStart = () => {
        if (username) {
            setUsername(inputUsername);
            onStart();
            return;
        }
        if (inputUsername.trim()) {
            setUsername(inputUsername);
            onStart();
        }
    };

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
                className={`text-lg md:text-xl mb-8 max-w-md mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                Discover your GitHub journey. See your contributions, streaks, and coding highlights.
            </motion.p>

            {/* Username input - only shown when no username in route */}
            {!username && (
                <motion.form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md mx-auto mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >

                    <div className="p-[4px] rounded-lg bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500">
                        <input
                            type="text"
                            placeholder="Enter your GitHub username"
                            value={inputUsername}
                            onChange={(e) =>
                                setInputUsername(e.target.value.replace(/\s+/g, ''))
                            }
                            className={`
                                    w-full rounded-lg px-6 py-4 text-lg font-medium
                                    focus:outline-none focus:ring-4 focus:ring-offset-2
                                    focus:ring-offset-gray-100 focus:ring-violet-500
                                    ${isDark
                                    ? 'bg-gray-900 text-white placeholder-gray-400'
                                    : 'bg-white text-gray-900 placeholder-gray-500'}
                                `}
                        />
                    </div>
                </motion.form>
            )}

            <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: username ? 0.9 : 1.0 }}
            >
                {username ? (
                    <AnimatedButton onClick={handleStart}>
                        <div className='flex items-center justify-evenly min-w-32'>
                            <div />
                            <p>Start</p>
                            <FaChevronRight />
                        </div>
                    </AnimatedButton>
                ) : (
                    <AnimatedButton onClick={handleStart}>
                        <div className='flex items-center justify-evenly min-w-32'>
                            <div />
                            <p>Let's Go</p>
                            <FaChevronRight />
                        </div>
                    </AnimatedButton>
                )}
            </motion.div>

        </motion.div>
    );
};


export default YearInIntro;
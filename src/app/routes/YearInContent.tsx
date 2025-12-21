import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { FaChevronRight, FaGithub } from 'react-icons/fa';
import AnimatedButton from '../_components/AnimatedButton';
import YearInProgress from '../_components/YearInContent/YearInProgress';
import { YearStatCards } from '../_components/YearInContent/YearStatCards';
import { useTheme } from '../context/AppThemeProvider';
import { getCurrentStatType, useYearInGithubStore } from '../store/yearInGithubStore';

interface YearInContentProps {
    selectedYear: number;
    username: string;
}

const YearInContent: React.FC<YearInContentProps> = ({ selectedYear, username }) => {
    const { currentIndex, next, previous, stats } = useYearInGithubStore();
    const currentStatType = getCurrentStatType(currentIndex);
    const isIntro = currentStatType === 'intro';
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        // Call immediately on mount
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
            {/* Mobile tap zones - Instagram style */}
            {!isIntro && isMobile && (
                <>
                    {/* Left tap zone - Previous */}
                    <div
                        className="absolute left-0 top-0 w-1/3 h-full z-20 cursor-pointer"
                        onClick={previous}
                        aria-label="Previous"
                    />
                    {/* Right tap zone - Next */}
                    <div
                        className="absolute right-0 top-0 w-2/3 h-full z-20 cursor-pointer"
                        onClick={next}
                        aria-label="Next"
                    />
                </>
            )}

            <div className="flex-1 flex items-center justify-center w-full">
                <AnimatePresence mode="wait">
                    {isIntro ? (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <YearInIntro
                                selectedYear={selectedYear}
                                username={username}
                                onStart={next}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-2xl"
                        >
                            <YearStatCards
                                stats={stats}
                                selectedYear={selectedYear}
                                username={username}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Controls - Desktop only */}
            {!isIntro && !isMobile && <YearInProgress onNext={next} onPrevious={previous} />}

            {/* Mobile progress indicator */}
            {!isIntro && isMobile && <MobileProgressBar />}

            <YearInFooter />
        </div>
    );
};

// Mobile progress bar (simplified dots at top)
const MobileProgressBar: React.FC = () => {
    const { currentIndex } = useYearInGithubStore();
    const totalSlides = 7; // Excluding intro

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-4 z-30"
        >
            {[...Array(totalSlides)].map((_, i) => (
                <div
                    key={i}
                    className={`h-1 flex-1 max-w-8 rounded-full transition-all duration-300 ${i < currentIndex
                        ? 'bg-white'
                        : i === currentIndex
                            ? 'bg-white/80'
                            : 'bg-white/30'
                        }`}
                />
            ))}
        </motion.div>
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

interface YearInIntroProps extends YearInContentProps {
    onStart: () => void;
}

const YearInIntro: React.FC<YearInIntroProps> = ({ selectedYear, username, onStart }) => {
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
                transition={{ duration: 0.6, delay: 0.9 }}
            >
                <AnimatedButton onClick={onStart}>
                    <div className='flex items-center justify-center gap-2 min-w-32'>
                        <p>Start</p>
                        <FaChevronRight />
                    </div>
                </AnimatedButton>
            </motion.div>
        </motion.div>
    );
};

export default YearInContent;

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react';
import YearInIntro from '../_components/YearInContent/YearInIntro';
import YearInProgress from '../_components/YearInContent/YearInProgress';
import { YearStatCards } from '../_components/YearInContent/YearStatCards';
import { useTheme } from '../context/AppThemeProvider';
import { getCurrentStatType, useYearInGithubStore } from '../store/yearInGithubStore';

interface YearInContentProps {
    selectedYear: number;
}

const YearInContent: React.FC<YearInContentProps> = ({ selectedYear }) => {
    const { currentIndex, next, previous, stats } = useYearInGithubStore();
    const currentStatType = getCurrentStatType(currentIndex);
    const isIntro = currentStatType === 'intro';
    const [isMobile, setIsMobile] = React.useState(false);
    const { username } = useYearInGithubStore();
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
            {!isIntro && isMobile && (
                <>
                    {/* Left tap zone - Previous */}
                    <div
                        className="absolute left-0 top-0 w-1/3 h-full z-20 cursor-pointer"
                        onClick={() => {
                            if (currentIndex > 1) {
                                previous();
                            }
                        }}
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

interface MobileProgressBarProps {
    slideDuration?: number; // Duration in seconds, defaults to 5
}

const MobileProgressBar: React.FC<MobileProgressBarProps> = ({ slideDuration = 5 }) => {
    const { currentIndex, next } = useYearInGithubStore();
    const totalSlides = 7; // Excluding intro (indices 1-7 in store)
    const slideIndex = currentIndex - 1; // Convert to 0-based for progress bar (0-6)
    const [progress, setProgress] = React.useState(0);

    // Auto-advance timer
    React.useEffect(() => {
        setProgress(0); // Reset progress when slide changes

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + (100 / (slideDuration * 20)); // Update ~20 times per second
                return newProgress >= 100 ? 100 : newProgress;
            });
        }, 50);

        const slideTimer = setTimeout(() => {
            if (currentIndex < totalSlides) {
                next();
            }
        }, slideDuration * 1000);

        return () => {
            clearInterval(progressTimer);
            clearTimeout(slideTimer);
        };
    }, [currentIndex, slideDuration, next, totalSlides]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 px-4 z-30"
        >
            {[...Array(totalSlides)].map((_, i) => {
                const isCompleted = i < slideIndex;
                const isCurrent = i === slideIndex;
                const isUpcoming = i > slideIndex;

                return (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full overflow-hidden ${isUpcoming ? 'bg-white/20' : 'bg-white/20'
                            }`}
                    >
                        {/* Completed slides - full white */}
                        {isCompleted && (
                            <div className="h-full w-full bg-white" />
                        )}
                        {/* Current slide - animated fill */}
                        {isCurrent && (
                            <div
                                className="h-full bg-white transition-none"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </div>
                );
            })}
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

export default YearInContent;

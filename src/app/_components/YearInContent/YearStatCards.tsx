import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { getCurrentStatType, useYearInGithubStore, YearStats, YearStatType } from '../../store/yearInGithubStore';
import YearInCommits from './YearInCommits';
import YearInDays from './YearInDays';
import YearInLanguage from './YearInLanguage';
import YearInMostActive from './YearInMostActive';
import YearInPrs from './YearInPrs';
import YearInStreak from './YearInStreak';

interface StatCardProps {
    stats: YearStats;
    selectedYear: number;
    username: string;
}

// Slide animation variants
const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? 300 : -300,
        opacity: 0,
        scale: 0.9,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
        x: direction === 'forward' ? -300 : 300,
        opacity: 0,
        scale: 0.9,
    }),
};

// Base card wrapper
export const StatCardWrapper: React.FC<{ children: React.ReactNode; icon: React.ReactNode; gradient: string }> = ({
    children,
    icon,
    gradient
}) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <motion.div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${gradient}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
                <div className="text-4xl text-white">{icon}</div>
            </motion.div>
            {children}
        </div>
    );
};


export const SummaryCard: React.FC<StatCardProps> = ({ stats, selectedYear, username }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    return (
        <StatCardWrapper icon={<FaGithub />} gradient="bg-gradient-to-br from-gray-700 to-gray-900">
            <motion.h2
                className={`text-3xl md:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                Your {selectedYear} in a nutshell
            </motion.h2>
            <motion.div
                className="grid grid-cols-2 gap-4 text-left max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Commits</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalCommits.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>PRs</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalPRs}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Days</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeDays}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Best Streak</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.longestStreak} days</p>
                </div>
            </motion.div>
        </StatCardWrapper>
    );
};

// Main component that renders cards based on current index
export const YearStatCards: React.FC<StatCardProps> = (props) => {
    const { currentIndex, direction } = useYearInGithubStore();
    const currentStatType = getCurrentStatType(currentIndex);

    const renderCard = () => {
        switch (currentStatType) {
            case YearStatType.totalCommits:
                return <YearInCommits key="commits" {...props} />;
            case YearStatType.totalPRs:
                return <YearInPrs key="prs" {...props} />;
            case YearStatType.activeDays:
                return <YearInDays key="active" {...props} />;
            case YearStatType.longestStreak:
                return <YearInStreak key="streak" {...props} />;
            case YearStatType.mostActiveDay:
                return <YearInMostActive key="day" {...props} />;
            case YearStatType.topLanguage:
                return <YearInLanguage key="language" {...props} />;
            case YearStatType.summary:
                return <SummaryCard key="summary" {...props} />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence mode="wait" custom={direction}>
            <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                }}
            >
                {renderCard()}
            </motion.div>
        </AnimatePresence>
    );
};

export default YearStatCards;

import { motion } from 'framer-motion';
import React from 'react';
import { FaCalendarCheck, FaCode, FaCodeBranch, FaFire, FaGithub, FaLaptopCode, FaTrophy } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { useYearInGithubStore, YearStats } from '../../store/yearInGithubStore';

interface YearInSummaryProps {
    stats: YearStats;
    selectedYear: number;
}

const YearInSummary: React.FC<YearInSummaryProps> = ({ stats, selectedYear }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const { user } = useYearInGithubStore();

    const statItems = [
        {
            label: 'Contributions',
            value: stats.totalCommits.toLocaleString(),
            icon: <FaCodeBranch />,
            gradient: 'from-green-500 to-emerald-600',
            delay: 0.1
        },
        {
            label: 'Pull Requests',
            value: stats.totalPRs.toString(),
            icon: <FaCode />,
            gradient: 'from-purple-500 to-violet-600',
            delay: 0.2
        },
        {
            label: 'Active Days',
            value: stats.activeDays.toString(),
            icon: <FaCalendarCheck />,
            gradient: 'from-blue-500 to-cyan-600',
            delay: 0.3
        },
        {
            label: 'Best Streak',
            value: `${stats.longestStreak} days`,
            icon: <FaFire />,
            gradient: 'from-orange-500 to-red-600',
            delay: 0.4
        },
        {
            label: 'Most Active',
            value: stats.mostActiveDay,
            icon: <FaTrophy />,
            gradient: 'from-yellow-500 to-amber-600',
            delay: 0.5
        },
        {
            label: 'Top Language',
            value: stats.topLanguage,
            icon: <FaLaptopCode />,
            gradient: 'from-pink-500 to-rose-600',
            delay: 0.6
        },
    ];

    return (
        <div className="flex flex-col items-center justify-center text-center w-full max-w-lg mx-auto">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6"
            >
                {user?.avatar_url ? (
                    <div className="relative">
                        <motion.div
                            className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 blur-lg opacity-60"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <img
                            src={user.avatar_url}
                            alt={user.name || user.login}
                            className="relative w-24 h-24 rounded-full border-4 border-white/20"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                        <FaGithub className="text-4xl text-white" />
                    </div>
                )}
            </motion.div>

            {/* Username */}
            <motion.p
                className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                @{user?.login || 'github-user'}
            </motion.p>

            {/* Title */}
            <motion.h2
                className={`text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                Your {selectedYear} Wrapped 🎉
            </motion.h2>
            <GHGraph />

            {/* Stats Grid */}
            <motion.div
                className="grid grid-cols-2 gap-4 w-full mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {statItems.map((item) => (
                    <motion.div
                        key={item.label}
                        className="relative group"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: item.delay, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    >
                        {/* Gradient border glow */}
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300`} />

                        {/* Card content */}
                        <div className={`relative p-5 rounded-2xl ${isDark ? 'bg-gray-900/80' : 'bg-white/90'} backdrop-blur-xl border ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                            {/* Icon with gradient background */}
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 shadow-lg mx-auto`}>
                                <span className="text-white text-lg">{item.icon}</span>
                            </div>

                            {/* Value */}
                            <p className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.value}
                            </p>

                            {/* Label */}
                            <p className={`text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {item.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* What a year message */}
            <motion.div
                className="mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    What a year! 🚀
                </p>
            </motion.div>
        </div>
    );
};

export default YearInSummary;

interface GHGraphProps { }

interface ContributionDay {
    date: string;
    contributionCount: number;
    color: string;
    weekday: number;
}

interface ContributionWeek {
    contributionDays: ContributionDay[];
}

const GHGraph: React.FC<GHGraphProps> = () => {
    const { githubRawData } = useYearInGithubStore();
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';

    if (!githubRawData?.user?.contributionsCollection?.contributionCalendar) {
        return null;
    }

    const calendar = githubRawData.user.contributionsCollection.contributionCalendar;
    const weeks: ContributionWeek[] = calendar.weeks;
    const months = calendar.months;

    // Get contribution level color
    const getColor = (count: number): string => {
        if (count === 0) return isDark ? '#161b22' : '#ebedf0';
        if (count <= 3) return isDark ? '#0e4429' : '#9be9a8';
        if (count <= 6) return isDark ? '#006d32' : '#40c463';
        if (count <= 9) return isDark ? '#26a641' : '#30a14e';
        return isDark ? '#39d353' : '#216e39';
    };

    return (
        <motion.div
            className="w-full mt-6 card bg-white/80 p-4 backdrop-blur-xl border border-gray-200 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
        >
            {/* Month labels */}
            <div className="flex mb-1 text-xs pl-0">
                <div className="flex w-full justify-between px-1">
                    {months.slice(0, 12).map((month: { name: string }, i: number) => (
                        <span
                            key={i}
                            className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-[10px]`}
                        >
                            {month.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Contribution grid */}
            <div className="flex gap-[2px] overflow-hidden">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                        {week.contributionDays.map((day, dayIndex) => (
                            <motion.div
                                key={dayIndex}
                                className="w-[8px] h-[8px] rounded-[2px]"
                                style={{ backgroundColor: getColor(day.contributionCount) }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.8 + (weekIndex * 0.01),
                                    duration: 0.2
                                }}
                                title={`${day.date}: ${day.contributionCount} contributions`}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

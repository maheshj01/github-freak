import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { FaChevronRight, FaGithub } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { useLazyGitHubContributionsQuery } from '../../context/GHContext';
import { useGitHubUser } from '../../hooks/GithubUser';
import { useYearInGithubStore } from '../../store/yearInGithubStore';
import AnimatedButton from '../AnimatedButton';

interface YearInIntroProps {
    selectedYear: number;
    onStart: () => void;
}

const YearInIntro: React.FC<YearInIntroProps> = ({ selectedYear, onStart }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const { username, setUsername, setStats, setLoading, setGithubRawData } = useYearInGithubStore();
    const [inputUsername, setInputUsername] = React.useState('');
    const { fetchContributions, loading, error, data } = useLazyGitHubContributionsQuery();
    const { user, loading: userLoading, error: userError } = useGitHubUser(username);
    const fromDate = new Date(selectedYear, 0, 1);
    const toDate = new Date(selectedYear, 11, 31);

    // Analyze data when it's available
    useEffect(() => {
        if (data && data.user) {
            analyzeData(data);
        }
    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleStart();
    };

    const handleStart = async () => {
        console.log("start user:", user)
        const targetUsername = username || inputUsername.trim();
        if (!targetUsername) return;

        // Set username in store if not already set
        if (!username) {
            setUsername(targetUsername);
        }

        // Set loading state
        setLoading(true);

        try {
            // Fetch contributions and PR count in parallel
            const [result, prCount] = await Promise.all([
                fetchContributions(targetUsername, fromDate, toDate),
                fetchPullRequests(targetUsername)
            ]);

            if (result.data && result.data.user) {
                await analyzeData(result.data, prCount);
                setGithubRawData(result.data);
                onStart();
            }
        } catch (err) {
            console.error('Error fetching contributions:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch pull requests for the year using GitHub Search API
    const fetchPullRequests = async (targetUsername: string): Promise<number> => {
        try {
            const startDate = `${selectedYear}-01-01`;
            const endDate = `${selectedYear}-12-31`;
            const query = `author:${targetUsername}+type:pr+created:${startDate}..${endDate}`;
            const url = `https://api.github.com/search/issues?q=${query}&per_page=1`;

            const response = await fetch(url);
            if (!response.ok) {
                console.error('Failed to fetch PRs:', response.statusText);
                return 0;
            }

            const data = await response.json();
            return data.total_count || 0;
        } catch (err) {
            console.error('Error fetching pull requests:', err);
            return 0;
        }
    };

    const analyzeData = async (queryData: any, prCount: number = 0) => {
        if (!queryData?.user?.contributionsCollection?.contributionCalendar) return;

        const calendar = queryData.user.contributionsCollection.contributionCalendar;
        const weeks = calendar.weeks;
        const allDays = weeks.flatMap((week: any) => week.contributionDays);

        // Calculate stats
        let totalContributions = calendar.totalContributions;
        let activeDays = 0;
        let maxStreak = 0;
        let tempStreak = 0;
        const dayOfWeekCounts: { [key: number]: number } = {};

        for (const day of allDays) {
            if (day.contributionCount > 0) {
                activeDays++;
                tempStreak++;
                maxStreak = Math.max(maxStreak, tempStreak);

                // Track most active day of week
                dayOfWeekCounts[day.weekday] = (dayOfWeekCounts[day.weekday] || 0) + day.contributionCount;
            } else {
                tempStreak = 0;
            }
        }

        // Find most active day
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let mostActiveDay = 'Monday';
        let maxDayCount = 0;
        for (const [day, count] of Object.entries(dayOfWeekCounts)) {
            if (count > maxDayCount) {
                maxDayCount = count;
                mostActiveDay = dayNames[parseInt(day)];
            }
        }

        // Update store with analyzed stats
        setStats({
            totalCommits: totalContributions,
            totalPRs: prCount,
            activeDays,
            longestStreak: maxStreak,
            mostActiveDay,
            topLanguage: 'TypeScript', // Placeholder - would need separate query
        });

        console.log('Analyzed stats:', { totalContributions, prCount, activeDays, maxStreak, mostActiveDay });
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
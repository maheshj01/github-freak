import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { FaChevronRight, FaGithub, FaSpinner } from 'react-icons/fa';
import { useTheme } from '../../context/AppThemeProvider';
import { useLazyGitHubContributionsQuery } from '../../context/GHContext';
import Analytics from '../../services/Analytics';
import { useYearInGithubStore } from '../../store/yearInGithubStore';
import AnimatedButton from '../AnimatedButton';

interface YearInIntroProps {
    selectedYear: number;
    onStart: () => void;
}

const YearInIntro: React.FC<YearInIntroProps> = ({ selectedYear, onStart }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const { username, setUsername, setStats, isLoading, setLoading, setGithubRawData } = useYearInGithubStore();
    const [inputUsername, setInputUsername] = React.useState('');
    const { fetchContributions, error, data } = useLazyGitHubContributionsQuery();
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

    // Cache configuration
    const CACHE_KEY_PREFIX = 'github_year_stats_';
    const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

    interface CachedData {
        contributions: any;
        prCount: number;
        topLanguage: string;
        timestamp: number;
    }

    const getCacheKey = (user: string, year: number) => `${CACHE_KEY_PREFIX}${user}_${year}`;

    const getCachedData = (user: string, year: number): CachedData | null => {
        try {
            const cached = localStorage.getItem(getCacheKey(user, year));
            if (!cached) return null;

            const data: CachedData = JSON.parse(cached);
            const now = Date.now();

            // Check if cache is expired (1 hour)
            if (now - data.timestamp > CACHE_EXPIRY_MS) {
                localStorage.removeItem(getCacheKey(user, year));
                return null;
            }

            return data;
        } catch (err) {
            console.error('Error reading cache:', err);
            return null;
        }
    };

    const setCachedData = (user: string, year: number, contributions: any, prCount: number, topLanguage: string) => {
        try {
            const data: CachedData = {
                contributions,
                prCount,
                topLanguage,
                timestamp: Date.now(),
            };
            localStorage.setItem(getCacheKey(user, year), JSON.stringify(data));
        } catch (err) {
            console.error('Error writing cache:', err);
        }
    };

    const handleStart = async () => {
        const targetUsername = username || inputUsername.trim();
        if (!targetUsername) return;

        // Prevent double-click while loading
        if (isLoading) return;

        // Set username in store if not already set
        if (!username) {
            setUsername(targetUsername);
        }

        // Set loading state
        setLoading(true);

        try {
            const cached = getCachedData(targetUsername, selectedYear);

            if (cached) {
                Analytics.logYearInGithubSearch(targetUsername, selectedYear);
                await analyzeData(cached.contributions, cached.prCount, cached.topLanguage);
                setGithubRawData(cached.contributions);
                onStart();
                return;
            }

            // Fetch contributions, PR count, and top language in parallel
            const [result, prCount, topLanguage] = await Promise.all([
                fetchContributions(targetUsername, fromDate, toDate),
                fetchPullRequests(targetUsername),
                fetchMostActiveLanguage(targetUsername)
            ]);

            if (result.data && result.data.user) {
                // Cache the results
                setCachedData(targetUsername, selectedYear, result.data, prCount, topLanguage);

                // Track analytics
                Analytics.logYearInGithubSearch(targetUsername, selectedYear);

                await analyzeData(result.data, prCount, topLanguage);
                setGithubRawData(result.data);
                // Don't reset loading here - let the transition happen with loading state
                onStart();
            } else {
                // Only reset loading on failure/no data
                setLoading(false);
            }
        } catch (err) {
            console.error('Error fetching contributions:', err);
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

    const analyzeData = async (queryData: any, prCount: number = 0, topLanguage: string = 'Unknown') => {
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
            topLanguage,
        });

        // console.log('Analyzed stats:', { totalContributions, prCount, activeDays, maxStreak, mostActiveDay, topLanguage });
    };

    const fetchMostActiveLanguage = async (targetUsername: string): Promise<string> => {
        try {
            // Fetch user's recent repos (sorted by most recently pushed)
            const response = await fetch(
                `https://api.github.com/users/${targetUsername}/repos?sort=pushed&per_page=100`
            );

            if (!response.ok) {
                console.error('Failed to fetch repos:', response.statusText);
                return 'Unknown';
            }

            const repos = await response.json();

            // Count languages across repos
            const languageCounts: { [key: string]: number } = {};

            for (const repo of repos) {
                if (repo.language) {
                    languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
                }
            }

            // Find the most used language
            let topLanguage = 'Unknown';
            let maxCount = 0;

            for (const [language, count] of Object.entries(languageCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    topLanguage = language;
                }
            }

            return topLanguage;
        } catch (err) {
            console.error('Error fetching languages:', err);
            return 'Unknown';
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
                transition={{ duration: 0.6, delay: 0.3 }}>
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
                    <AnimatedButton onClick={handleStart} disabled={isLoading}>
                        <div className='flex items-center justify-evenly min-w-32'>
                            {isLoading ? (
                                <FaSpinner className="animate-spin mx-12" />
                            ) : (
                                <>
                                    <div />
                                    <p>Start</p>
                                    <FaChevronRight />
                                </>
                            )}
                        </div>
                    </AnimatedButton>
                ) : (
                    <AnimatedButton onClick={handleStart} disabled={isLoading || !inputUsername.trim()}>
                        <div className='flex items-center justify-evenly min-w-32'>
                            {isLoading ? (
                                <FaSpinner className="animate-spin mx-12" />
                            ) : (
                                <>
                                    <div />
                                    <p>Let's Go</p>
                                    <FaChevronRight />
                                </>
                            )}
                        </div>
                    </AnimatedButton>
                )}
            </motion.div>

        </motion.div>
    );
};


export default YearInIntro;
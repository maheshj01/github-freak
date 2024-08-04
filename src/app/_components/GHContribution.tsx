import React, { useEffect } from 'react';
import { getCurrentDayOfYear } from '../../lib/utils';
import { useDarkMode } from '../AppThemeProvider';
import { useGitHubContributions } from '../services/ApolloClient';

interface GithubContribution {
    maxStreak: number;
    currentStreak: number;
    totalContributions: number;
}

function GHContribution({ username, className, graphYear }: { username: string, className?: string, graphYear: number }) {
    const { darkMode } = useDarkMode();
    // Calculate the date range for the current year
    const currentYear = new Date().getFullYear();
    const fromDate = new Date(graphYear, 0, 1);
    const toDate = new Date(graphYear, 11, 31);
    const [contributionStats, setContributionStats] = React.useState<GithubContribution | null>(null);
    const { loading, error, data } = useGitHubContributions(username, fromDate, toDate);

    useEffect(() => {
        if (data && data.user) {
            const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
            getContributionStats(weeks);
        }
    }, [data, graphYear]);

    const getContributionStats = (weeks: any) => {
        const dayoftheYear = getCurrentDayOfYear();
        let totalContributions = 0;
        let maxStreak = 0;
        let currentStreak = 0;
        let currentStreakEnd = 0;
        var count = 0
        weeks.forEach((week: any) => {
            week.contributionDays.forEach((day: any) => {
                totalContributions += day.contributionCount;
                if (count <= dayoftheYear) {
                    if (day.contributionCount > 0) {
                        currentStreakEnd += 1;
                        if (currentStreakEnd > maxStreak) {
                            maxStreak = currentStreakEnd;
                        }
                    } else {
                        currentStreak = currentStreakEnd;
                        currentStreakEnd = 0;
                    }
                }
                count += 1;
            });
        });
        if (currentYear !== graphYear) {
            currentStreak = 0;
        }

        setContributionStats({
            maxStreak: maxStreak,
            currentStreak: currentStreak,
            totalContributions: totalContributions
        });
    }

    const styles = {
        dark: {
            zero: 'rgba(255,255,255,0.1)',
        },
        light: {
            zero: 'rgba(0,0,0,0.1)',
        }
    }
    function getContributionColor(count: number, day: any) {
        if (count === 0) {
            return styles[darkMode ? 'dark' : 'light'].zero;
        }
        return day.color;
    }

    function DayContribution(props: { day: any, weekIndex: number, dayIndex: number }) {
        const { day, weekIndex, dayIndex } = props;
        return (
            <div
                key={`${weekIndex}-${dayIndex}`}
                className="w-2 h-2 sm:w-3 sm:h-3 xs:w-2 rounded-xs"
                style={{
                    backgroundColor: getContributionColor(day.contributionCount, day),
                }}
                title={`${day.date}: ${day.contributionCount} contributions`}
            />
        );
    }

    function Stats({ label, value }: { label: string; value: string | undefined }) {
        return (
            <p className={`hidden sm:block lg:text-md md:text-sm sm:text-xs ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                {label}: {value}
            </p>
        );
    }

    // if (loading) return <p className='text-black dark:text-white'>Loading...</p>;
    // if (error) return <p className='text-red-500 dark:text-red-400'>Error: {error.message}</p>;

    var weeks = [];
    if (loading || error) {
        weeks = [...Array(53)];
    } else {
        weeks = data.user.contributionsCollection.contributionCalendar.weeks;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
        'Dec']

    const days = ['Mon', 'Wed', 'Fri'];
    return (
        <div className={`p-4 rounded-lg overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} ${className}`}>
            <div className='flex flex-grow justify-between '>
                <div className='flex flex-grow'>
                    <div className='flex flex-col'>
                        <div className='flex space-x-2'>
                            <p className={`text-md md:text-2xl sm:text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Github Contributions
                            </p>
                        </div>
                        {/* <Stats label='Total Contributions' value={loading ? '' : contributionStats?.totalContributions.toString()} /> */}
                    </div>
                    <div className='flex flex-col mx-2'>
                        {(currentYear === graphYear) && < Stats label='Current Streak' value={loading ? '' : contributionStats?.currentStreak.toString()} />}

                        <Stats label='Max Streak' value={loading ? '' : contributionStats?.maxStreak.toString()} />
                        <Stats label='total Contributions' value={loading ? '' : contributionStats?.totalContributions.toString()} />
                    </div>
                </div>
            </div>
            <div className='flex items-center'>
                <div className='flex flex-col gap-1 lg:mt-5 md:mt-4 sm: xs:mt-2 text-xs sm:text-lg'>
                    {days.map((day, index) => (
                        <div key={index} className='w-10 text-xs sm:text-lg dark:text-white'>
                            {day}
                        </div>
                    ))}
                </div>

                <div className='w-full overflow-x-auto'>
                    <div className='inline-block w-full pr-2'>
                        <div className='pl-2 flex gap-8 sm:gap-10 md:gap-10 lg:gap-8'>
                            {months.map((month, index) => (
                                <div key={index} className='w-10 text-xs sm:text-lg dark:text-white'>
                                    {month}
                                </div>
                            ))}
                        </div>
                        {(
                            <div className='flex gap-1 rounded-md p-2'>
                                {(!loading && !error) ? (
                                    weeks.map((week: any, weekIndex: number) => (
                                        <div key={weekIndex} className='flex flex-col gap-1'>
                                            {week.contributionDays.map((day: any, dayIndex: number) => (
                                                <DayContribution
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    day={day}
                                                    weekIndex={weekIndex}
                                                    dayIndex={dayIndex}
                                                />
                                            ))}
                                        </div>
                                    ))
                                )
                                    : (weeks.map((_: any, weekIndex: number) => (
                                        <div key={weekIndex} className='flex flex-col gap-1'>
                                            {[...Array(7)].map((_, dayIndex) => (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className="w-2 h-2 sm:w-3 sm:h-3 xs:w-2 rounded-xs"
                                                    style={{
                                                        backgroundColor: styles[darkMode ? 'dark' : 'light'].zero,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    ))
                                    )
                                }
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GHContribution;
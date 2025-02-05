import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaGithub } from "react-icons/fa";
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GHContribution from '../_components/GHContribution';
import { DropdownMenuButton } from '../_components/dropdown';
import { Input } from '../_components/input';
import StreakCard from '../_components/StreakCard';
import Loading from '../_components/Loading';
import { useGitHubContributionsQuery } from '../context/GHContext';
import { downloadImage, getCurrentDayOfYear } from '../../lib/utils';
import WeeklyChart from '../_components/WeekStats';
import MonthlyContributionChart from '../_components/MonthlyStats';
import GHProfileCard from '../_components/GHProfileCard';
import { useGitHubUser } from '../hooks/GithubUser';
import { useTheme } from '../context/AppThemeProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../_components/tabs";
import GHChart from '../_components/GHChart';
import GHLegend from '../_components/GHLegend';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { TooltipProvider } from '../_components/tooltip';
import GHAreaChart from '../_components/AreaChart';
import Analytics from '../services/Analytics';
import LegendThemeSelector from '../_components/LegendThemeSelector';
import { useAppDispatch, useAppSelector } from '../hooks/Legend';
import { setNumberOfYears } from '../redux/reducers/legendSlice';

interface GithubContribution {
    maxStreak: number;
    currentStreak: number;
    totalContributions: number;
    activeDays: number;
}

export default function GHStats() {
    const { username } = useParams();
    // defines whether search bar has scrolled
    const [inputUsername, setInputUsername] = useState('');
    const [searchUsername, setSearchUsername] = useState('');
    const [searchReady, setSearchReady] = useState(false);
    const currentYear = new Date().getFullYear();
    const [graphYear, setGraphYear] = React.useState<number>(currentYear);
    const fromDate = new Date(graphYear, 0, 1);
    const toDate = new Date(graphYear, 11, 31);
    const [contributionStats, setContributionStats] = React.useState<GithubContribution | null>(null);
    const { user } = useGitHubUser(searchUsername);
    const { loading, error, data } = useGitHubContributionsQuery(searchUsername, fromDate, toDate);
    console.log(data)
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState<string>('stats');
    const numberOfYears = useAppSelector((state) => state.legend.numberOfYears) || 5;
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (username) {
            setInputUsername(username);
            setSearchUsername(username);
            triggerSearch(username);
        }
    }, [username]);

    const triggerSearch = (searchUsername: string) => {
        setSearchReady(false);
        setTimeout(() => {
            setSearchReady(true);
        }, 1000);
        if (searchUsername !== username) {
            navigate(`/${searchUsername}`);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputUsername !== searchUsername) {
            setSearchUsername(inputUsername);
            triggerSearch(inputUsername);
        }
    };
    useEffect(() => {
        if (data && data.user) {
            const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
            getContributionStats(weeks);
        }
    }, [data])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\s+/g, '');
        if (inputUsername !== newValue) {
            Analytics.logSearch(inputUsername);
            setInputUsername(newValue);
        }
    };

    const getContributionStats = (weeks: any) => {

        let maxStreak = 0;
        let currentStreak = 0;
        let tempStreak = 0;
        let activeDays = 0;
        let totalContributions = 0

        const allDays = weeks.flatMap((week: any) => week.contributionDays);

        const currentDayOfYear = getCurrentDayOfYear();
        const relevantDays = allDays.slice(0, currentDayOfYear - 1);
        const reversedRelevantDays = relevantDays.reverse();

        // Calculate current streak in reverse
        for (const day of reversedRelevantDays) {
            if (day.contributionCount > 0) {
                tempStreak++;
                currentStreak = tempStreak;  // Update current streak as we go
                maxStreak = Math.max(maxStreak, tempStreak);
            } else {
                break;
            }
        }
        tempStreak = 0
        // Check for all-time max streak
        for (const day of allDays) {
            totalContributions += day.contributionCount;
            if (day.contributionCount > 0) {
                activeDays++;
                tempStreak++;
                maxStreak = Math.max(maxStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        if (currentYear !== graphYear) {
            currentStreak = 0;
        }
        setContributionStats({
            maxStreak,
            currentStreak,
            totalContributions,
            activeDays
        });
    };

    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <div id="githubprofile" className={`min-h-screen bg-gradient ${isDark ? 'theme-blue-light' : 'theme-aqua-light'}`}>
            <motion.div
                className={`flex flex-col items-center justify-center h-40`}
                animate={{ height: '10rem' }}
                transition={{ duration: 0.5 }}>
                <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
                    <div className="flex items-center justify-center mb-8">
                        <FaGithub className="text-6xl" />
                        <div className='hidden md:block
                        
                        '><p className='text-2xl mx-6 font-mono' > Hello Freaks!</p></div>
                    </div>
                    <Input
                        placeholder="Enter your Github username"
                        className={`w-full px-4 py-2 ${isDark ? 'bg-transparent text-white' : 'bg-gray-300 text-black'} border rounded-lg focus:outline-none focus:border-white-500 text-center text-lg font-mono`}
                        value={inputUsername}
                        onChange={handleInputChange}
                    />
                </form>
            </motion.div>
            {searchReady && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="container mx-auto px-4 py-4"
                >
                    <div className='flex justify-center'>
                        {user && <GHProfileCard user={user} />}
                    </div>
                    <div className='py-8'>
                        <Tabs
                            onValueChange={setTabValue}
                            defaultValue="stats" className="">
                            <div className='flex justify-between items-center w-full max-w-screen-lg mx-auto px-4'>
                                {tabValue === 'graphs' ? (<div className='flex gap-2'>
                                    <LegendThemeSelector />
                                    <p className='text-xl font-bold'>Years</p>
                                    <DropdownMenuButton
                                        onClick={(year) => {
                                            dispatch(setNumberOfYears(year));
                                        }}
                                        className='text-md md:text-xl text-xl font-bold'
                                        options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                        selected={numberOfYears}
                                    />
                                </div>
                                ) : (<div />)}
                                < div className='flex justify-center flex-grow'>
                                    <TabsList className='w-full max-w-[400px]'>
                                        <TabsTrigger value="stats" className='flex-grow'>Github Stats</TabsTrigger>
                                        <TabsTrigger value="graphs" className='flex-grow'>Contribution Graphs(5 years)</TabsTrigger>
                                    </TabsList>
                                </div>
                                {tabValue === 'graphs' && (<div className='w-10 flex justify-end'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <FaDownload
                                                    onClick={() => downloadImage()}
                                                    className='text-3xl cursor-pointer'
                                                    aria-label="Download Image"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {`Download Image`}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                )}
                            </div>
                            <TabsContent value="stats" className='min-h-fit'>
                                <div className='flex space-x-2 py-2 mt-6 items-center'>
                                    {user && <p className="text-2xl font-bold">GitHub Stats</p>}
                                    <DropdownMenuButton
                                        onClick={setGraphYear}
                                        className='text-md md:text-2xl text-2xl font-bold'
                                        options={[currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4]}
                                        selected={graphYear.toString()}
                                    />
                                </div>
                                <div className='flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0'>
                                    <GHContribution
                                        username={searchUsername}
                                        data={data}
                                        loading={loading}
                                        error={error}
                                        className='rounded-lg'
                                        title={`Contribution Chart`}
                                    />
                                    <StreakCard
                                        isCurrentYear={currentYear === graphYear}
                                        currentStreak={contributionStats?.currentStreak}
                                        maxStreak={contributionStats?.maxStreak}
                                        activeDays={contributionStats?.activeDays}
                                        totalContributions={contributionStats?.totalContributions}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                    <WeeklyChart
                                        year={graphYear}
                                        data={data} />
                                    <MonthlyContributionChart
                                        year={graphYear}
                                        data={data} />
                                </div>
                                <GHAreaChart
                                    year={graphYear}
                                    data={data} />
                            </TabsContent>
                            <TabsContent value="graphs" className='flex items-center justify-center'>
                                <div id='FiveYearChart' className={`my-4 flex flex-col`}>
                                    <GHLegend username={username!} />
                                    {
                                        [...Array(numberOfYears)].map((_, year) => {
                                            const fDate = new Date(currentYear - year, 0, 1);
                                            const tDate = new Date(currentYear - year, 11, 31);
                                            return (
                                                <div className='flex flex-col items-center justify-center'>
                                                    <GHChart
                                                        username={searchUsername}
                                                        fromDate={fDate}
                                                        toDate={tDate}
                                                        year={currentYear - year} />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </motion.div >
            )
            }
            {
                !searchReady && (
                    <Loading />
                )
            }
        </div >
    );
}

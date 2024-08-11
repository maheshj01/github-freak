import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from "react-icons/fa";
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GHContribution from '../_components/GHContribution';
import { DropdownMenuButton } from '../_components/dropdown';
import { Input } from '../_components/input';
import StreakCard from '../_components/StreakCard';
import Loading from '../_components/Loading';
import { useGitHubContributions } from '../context/GHContext';
import { getCurrentDayOfYear } from '../../lib/utils';
import WeeklyChart from '../_components/WeekStats';
import MonthlyContributionChart from '../_components/MonthlyStats';
import GHProfileCard from '../_components/GHProfileCard';
import { useGitHubUser } from '../hooks/GithubUser';

interface GithubContribution {
    maxStreak: number;
    currentStreak: number;
    totalContributions: number;
}

interface GitHubUser {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    location: string;
    blog: string;
    twitter_username: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
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
    const { user, loading: userLoading, error: userError } = useGitHubUser(searchUsername);
    const { loading, error, data } = useGitHubContributions(searchUsername, fromDate, toDate);
    const navigate = useNavigate();

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
        setInputUsername(e.target.value);
    };
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

    return (
        <div className="min-h-screen bg-slate-50">
            <motion.div
                className={`flex flex-col items-center justify-center h-40`}
                animate={{ height: '10rem' }}
                transition={{ duration: 0.5 }}
            >
                <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
                    <div className="flex items-center justify-center mb-4">
                        <FaGithub className="text-6xl text-black" />
                        <p className='text-2xl mx-6'> Hello Freaks!</p>
                    </div>
                    <Input
                        placeholder="Enter your username"
                        className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
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
                    <div className='flex '>
                        {user && <GHProfileCard user={user} />}
                    </div>
                    <div className='flex space-x-2 py-2 mt-6 items-center'>
                        {user && <p className="text-2xl font-bold">GitHub Stats</p>}
                        <DropdownMenuButton
                            onClick={setGraphYear}
                            className='text-md md:text-2xl text-2xl font-bold'
                            options={[currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4]}
                            selected={graphYear.toString()}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0'>
                        <GHContribution
                            username={searchUsername}
                            data={data}
                            loading={loading}
                            error={error}
                        />
                        <StreakCard
                            isCurrentYear={currentYear === graphYear}
                            currentStreak={contributionStats?.currentStreak}
                            maxStreak={contributionStats?.maxStreak}
                            totalContributions={contributionStats?.totalContributions}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <WeeklyChart
                            year={graphYear}
                            data={data} />
                        <MonthlyContributionChart
                            year={graphYear}
                            data={data} />
                    </div>
                </motion.div>
            )}
            {!searchReady && (
                <Loading />
            )}
        </div>
    );
}
